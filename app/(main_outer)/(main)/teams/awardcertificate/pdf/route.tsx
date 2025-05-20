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
    return (
    (!!person.team && typeof person.team !== "string" && person.team.name.length > 0 && !!person.team.awards) &&
    <View style={{position:"absolute", ...positionOffsets[0]}} wrap={false} >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image src={"public/OACparticipantandteamawardv1.png"} style={{position:"absolute", width:"100%", height:"100%"}}/>
      <Text debug={txtdbg} style={{...commmonTextStyles,top:"6.75cm",left: "0"}} hyphenationCallback={w => [w]}>{person.name}</Text>
      <Text debug={txtdbg} style={{...commmonTextStyles,top:"7.75cm",left: "0",minHeight:undefined,fontSize:"0.6rem"}} hyphenationCallback={w => [w]}>as part of Team</Text>
      <Text debug={txtdbg} style={{...commmonTextStyles,top:"8.25cm",left: "0",fontSize:"1.3rem",fontFamily:"OpenSans-Bold", fontWeight:"bold" }} hyphenationCallback={w => [w]}>{person.team.name}</Text>
      <Text debug={txtdbg} style={{...commmonTextStyles,top:"9.5cm",left: "0",minHeight:undefined,fontSize:"0.6rem"}} hyphenationCallback={w => [w]}>that received the</Text>
      <Text debug={txtdbg} style={{...commmonTextStyles,top:"10.15cm",left: "0",fontSize:"1.3rem",fontFamily:"OpenSans-Bold", fontWeight:"bold" }} hyphenationCallback={w => [w]}>{person.team.awards}</Text>
    </View>
  )}
  const peoplefilter = (person: Person) => (!!person.team && typeof person.team !== "string" && person.team.name.length > 0 && !!person.team.awards);
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