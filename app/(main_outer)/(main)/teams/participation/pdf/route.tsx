import { hasPermission } from "@/lib/permissions";
import { getPayload, Where } from "payload";
import config from '@payload-config'
import { Document, Font, Image, Page, pdf, Text, View } from "@react-pdf/renderer";
import { QRCodeSVGPDF } from "@/lib/qrcodePDF/qrcodePDF";
import { Person, Team } from "@/payload-types";
import { chunk } from "lodash";
import { NextRequest } from "next/server";
import * as qs from 'qs-esm'
import { Style } from "@react-pdf/stylesheet";
import { getServerUrl } from "@/lib/payload-authjs-custom/payload/session/getPayloadSession";
import { coachteamsquery } from "@/payload/collections/People";
import { auth } from "@/auth";
import ParticipBackgroundImage from "@/public/OACparticipantv3.png"

Font.register({family:"OpenSans", src:"./public/OpenSans-Medium.ttf", fontWeight: "medium"})
Font.register({family:"OpenSans-Bold", src:"./public/OpenSans-Bold.ttf", fontWeight: "bold"})


const PersonRoleAugment = ['VIP', 'Guest'] as const

interface PersonAugment {
  roleAugment: typeof PersonRoleAugment[number]
}

export async function GET(request: NextRequest){
  const session = await auth()
  const payload = await getPayload({config})
  const coachteamids = await coachteamsquery(session?.user ,payload) as string[]
  const checkTeamPeopleAdmin = (await hasPermission("view:people")) || (coachteamids).length > 0
  if (!checkTeamPeopleAdmin) return new Response(null)
  const qsearchParams = qs.parse(request.nextUrl.searchParams.toString(),{ignoreQueryPrefix:true, depth:10});
  console.dir({"qsearch":qsearchParams},{depth:10})
  const qsearchWhere = (qsearchParams.where ?? {}) as Where
  const qsearchSort = typeof qsearchParams.sort === "string" || (Array.isArray(qsearchParams.sort) && qsearchParams.sort.every(el => typeof el=== "string") )? qsearchParams.sort : undefined

  console.dir({"payload.config.serverURL":payload.config.serverURL,getServerUrl:await getServerUrl(),NEXT_PUBLIC_SERVER_URL:process.env.NEXT_PUBLIC_SERVER_URL})
  const serverurl  = await getServerUrl()

  const people = (await payload.find({collection:"people", pagination:false, overrideAccess:false, user:session?.user, limit:0,depth:1,sort:qsearchSort,where:qsearchWhere})).docs
  const positionOffsets = [
    {top:"0",  left:"0",  height:"99%", width:"100%"}]
  const commmonTextStyles: Style = {position:"absolute", width: "100%", minHeight: "1cm", textAlign:"center"}
  const txtdbg = false
  const PersonPDF = ({person}: {person:Person} ) => {

    // const personjson = (inperson.special_needs && inperson.special_needs.startsWith('{')) ? JSON.parse(inperson.special_needs) : {}
    // const personteamname = "roleAugment" in personjson ? (personjson as PersonAugment).roleAugment : inperson.role === 'day_visitor' ? "Day Visitor" : ""
    // if (personteamname !== "") console.log("personteamname",personteamname)
    // const augmentedteam = (!!inperson.team && typeof inperson.team !== "string" && personteamname === "") ? inperson.team : { name: personteamname, number: ''   }
    // const person = {...inperson, team: augmentedteam}
    return (
    (!!person.team && typeof person.team !== "string" && person.team.name.length > 0 ) &&
    <View style={{position:"absolute", ...positionOffsets[0]}} wrap={false} >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image src={"./public/OACparticipantv3.png"} style={{position:"absolute", width:"100%", height:"100%"}}/>
      <Text debug={txtdbg} style={{...commmonTextStyles,top:"7.25cm",left: "0"}} hyphenationCallback={w => [w]}>{person.name}</Text>
      <Text debug={txtdbg} style={{...commmonTextStyles,top:"8.25cm"/*4.1*/,left: "0",minHeight:undefined,fontSize:"0.6rem"}} hyphenationCallback={w => [w]}>of</Text>
      <Text debug={txtdbg} style={{...commmonTextStyles,top:"8.75cm"/*4.1*/,left: "0",minHeight:undefined,fontSize:"0.6rem"}} hyphenationCallback={w => [w]}>Team</Text>
      <Text debug={txtdbg} style={{...commmonTextStyles,top:"9.25cm"/*4.5*/,left: "0" }} hyphenationCallback={w => [w]}>{person.team.name}</Text>
    </View>
  )}
  const peoplefilter = (person: Person) => (!!person.team && typeof person.team !== "string" && person.team.name.length > 0);
  const OutDoc = ({people}:{ people:Person[] }) => (
    <Document style={{fontFamily:"OpenSans", fontWeight: "medium"}}>
      { people.filter(peoplefilter).map((person,idx) => (
        <Page key={idx} size="A4" orientation="landscape">
          <PersonPDF key={person.id} person={person}/>
        </Page>))}
    </Document>)

  const instance = pdf(<OutDoc people={people}/>);
  // const stream = await instance.toBuffer();
  // console.log(instance)
  // const stream = await renderToStream(<MyDocument />)
  // const b = await blob(stream)
  const b = await instance.toBlob()
  const response = new Response(b.stream())
  return response
}