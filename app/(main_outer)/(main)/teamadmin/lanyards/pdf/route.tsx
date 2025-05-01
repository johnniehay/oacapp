import { hasPermission } from "@/lib/permissions";
import { getPayload, Where } from "payload";
import config from '@payload-config'
import { Document, Font, Page, pdf, Text, View } from "@react-pdf/renderer";
import { QRCodeSVGPDF } from "@/lib/qrcodePDF/qrcodePDF";
import { Person, Team } from "@/payload-types";
import { chunk } from "lodash";
import { NextRequest } from "next/server";
import * as qs from 'qs-esm'
import { Style } from "@react-pdf/stylesheet";
import { getServerUrl } from "@/lib/payload-authjs-custom/payload/session/getPayloadSession";

Font.register({family:"OpenSans", src:"./public/OpenSans-Medium.ttf", fontWeight: "medium"})
Font.register({family:"OpenSans-Bold", src:"./public/OpenSans-Bold.ttf", fontWeight: "bold"})

export async function POST(request: NextRequest){
  const hasperm = await hasPermission("view:people") //TODO: maybe restrict permission
  if (!hasperm) return new Response(null)
  const payload = await getPayload({config})
  const qsearchParams = qs.parse(request.nextUrl.searchParams.toString(),{ignoreQueryPrefix:true, depth:10});
  console.dir({"qsearch":qsearchParams},{depth:10})
  const qsearchWhere = (qsearchParams.where ?? {}) as Where

  const people = (await payload.db.updateMany({collection:"people",options:{timestamps:false},where:qsearchWhere,data:{printedAt: new Date().toISOString()}}))
  return new Response(JSON.stringify(people))
}

const PersonRoleAugment = ['VIP', 'Guest'] as const

interface PersonAugment {
  roleAugment: typeof PersonRoleAugment[number]
}

export async function GET(request: NextRequest){
  const hasperm = await hasPermission("view:people") //TODO: maybe restrict permission
  if (!hasperm) return new Response(null)
  const payload = await getPayload({config})
  const qsearchParams = qs.parse(request.nextUrl.searchParams.toString(),{ignoreQueryPrefix:true, depth:10});
  console.dir({"qsearch":qsearchParams},{depth:10})
  const qsearchWhere = (qsearchParams.where ?? {}) as Where
  const qsearchSort = typeof qsearchParams.sort === "string" || (Array.isArray(qsearchParams.sort) && qsearchParams.sort.every(el => typeof el=== "string") )? qsearchParams.sort : undefined
  const qsearchStartPos= qsearchParams.startPos && typeof qsearchParams.startPos === "string" ? qsearchParams.startPos : '0'
  const startpos = ['0','1','2','3'].includes(qsearchStartPos) ? parseInt(qsearchStartPos) : 0
  console.dir({"payload.config.serverURL":payload.config.serverURL,getServerUrl:await getServerUrl(),NEXT_PUBLIC_SERVER_URL:process.env.NEXT_PUBLIC_SERVER_URL})
  const serverurl  = await getServerUrl()

  const people = (await payload.find({collection:"people", pagination:false, limit:0,sort:qsearchSort,where:qsearchWhere})).docs
  const positionOffsets = [
    {top:"0.6cm",  left:"1.1cm",  height:"12.2cm", width:"9.2cm"}, //0.5 1.2 for same printer
    {top:"0.6cm",  left:"10.55cm", height:"12.2cm", width:"9.2cm"}, //0.5 10.7 for same printer
    {top:"13.1cm", left:"1.1cm",  height:"12.2cm", width:"9.2cm"}, //13.0 1.2 for same printer
    {top:"13.1cm", left:"10.55cm", height:"12.2cm", width:"9.2cm"}] //13.0 10.7 for same printer
  const commmonTextStyles: Style = {position:"absolute", width: "8.2cm", minHeight: "1cm", textAlign:"center"}
  const txtdbg = false
  const PersonPDF = ({person: inperson, position}: {person:Person, position:number} ) => {

    const personjson = (inperson.special_needs && inperson.special_needs.startsWith('{')) ? JSON.parse(inperson.special_needs) : {}
    const personteamname = "roleAugment" in personjson ? (personjson as PersonAugment).roleAugment : inperson.role === 'day_visitor' ? "Day Visitor" : ""
    if (personteamname !== "") console.log("personteamname",personteamname)
    const augmentedteam = (!!inperson.team && typeof inperson.team !== "string" && personteamname === "") ? inperson.team : { name: personteamname, number: ''   }
    const person = {...inperson, team: augmentedteam}
    return (
    (!!person.team && person.team.name.length > 0 ) &&
    <View style={{position:"absolute", ...positionOffsets[position]}} debug={true} wrap={false} >
      {/*TeamNumberTop<Text debug={txtdbg} style={{position:"absolute",fontSize:"1rem",top:"1.9cm",left: "0.5cm",width: "4.1cm", textAlign:"left"}} hyphenationCallback={w => [w]}>Team #{person.team.number}</Text>*/}
      <Text debug={txtdbg} style={{...commmonTextStyles,bottom:"8cm",left: "0.5cm"}} hyphenationCallback={w => [w]}>{person.name}</Text>
      {/*<Text debug={true}  style={{position:"absolute",bottom:"10cm",left: "2cm", width: "6cm", fontSize:person.name.length>10?10:18,transform:person.name.length>100 ? [{operation:"scale", value:[0.5,0.5]}] : undefined}} >{person.name}</Text>*/}
      {personteamname === "" && <Text debug={txtdbg} style={{...commmonTextStyles,top:"4.6cm"/*4.1*/,left: "0.5cm",minHeight:undefined,fontSize:"0.6rem"}} hyphenationCallback={w => [w]}>Team</Text>}
      <Text debug={txtdbg} style={{...commmonTextStyles,top:"5.0cm"/*4.5*/,left: "0.5cm" }} hyphenationCallback={w => [w]}>{person.team.name}</Text>
      {/*TeamNumBotRight<Text debug={txtdbg} style={{position:"absolute",fontSize:"1rem",top:"6.2cm",left: "5.95cm",width: undefined, textAlign:"left"}} hyphenationCallback={w => [w]}>Team #{person.team.number}</Text>*/}
      <Text debug={txtdbg} style={{...commmonTextStyles,fontSize:"3rem",top:"6.2cm",left: "0.5cm", fontWeight:"bold", fontFamily:"OpenSans-Bold"}} hyphenationCallback={w => [w]}>{person.team.number}</Text>
      <QRCodeSVGPDF style={{position:"absolute",top:"8.8cm",left: "5.85cm"}} width={"29.5mm"} height={"29.5mm"} marginSize={4} value={`${serverurl}/person/${person.id}`}/>
    </View>
  )}
  const peoplefilter = (person: Person) => (!!person.team || person.role === "day_visitor" || (person.special_needs?.startsWith('{') ?? false));
  const blankpeople = (n: number)=> Array(n).fill({id: "", team:null}) as Person[];
  const OutDoc = ({people, startPos = 0}:{ people:Person[], startPos?:number}) => (
    <Document style={{fontFamily:"OpenSans", fontWeight: "medium"}}>
      { chunk(people.filter(peoplefilter).toSpliced(0,0,...blankpeople(startPos)),4).map((pagepeople,idx) => (
        <Page key={idx} size="A4">
          {pagepeople.map((person,idx) => <PersonPDF key={person.id} person={person} position={idx}/>)}
        </Page>))}
    </Document>)

  const instance = pdf(<OutDoc people={people} startPos={startpos}/>);
  // const stream = await instance.toBuffer();
  // console.log(instance)
  // const stream = await renderToStream(<MyDocument />)
  // const b = await blob(stream)
  const b = await instance.toBlob()
  const response = new Response(b.stream())
  return response
}