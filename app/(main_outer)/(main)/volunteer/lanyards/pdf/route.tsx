import { hasPermission } from "@/lib/permissions";
import { getPayload, Where } from "payload";
import config from '@payload-config'
import { Document, Font, Page, pdf, Text, View } from "@react-pdf/renderer";
import { QRCodeSVGPDF } from "@/lib/qrcodePDF/qrcodePDF";
import { User } from "@/payload-types";
import { chunk } from "lodash";
import { NextRequest } from "next/server";
import * as qs from 'qs-esm'
import { Style } from "@react-pdf/stylesheet";
import { getServerUrl } from "@/lib/payload-authjs-custom/payload/session/getPayloadSession";
import { rolePermissions } from "@/lib/roles";

Font.register({family:"OpenSans", src:"./public/OpenSans-Medium.ttf", fontWeight: "medium"})

export async function POST(request: NextRequest){
  const hasperm = await hasPermission("view:users") //TODO: maybe restrict permission
  if (!hasperm) return new Response(null)
  const payload = await getPayload({config})
  const qsearchParams = qs.parse(request.nextUrl.searchParams.toString(),{ignoreQueryPrefix:true, depth:10});
  console.dir({"qsearch":qsearchParams},{depth:10})
  const qsearchWhere = (qsearchParams.where ?? {}) as Where
  //TODO: add volunteer printed file
  // const users = (await payload.db.updateMany({collection:"users",options:{timestamps:false},where:qsearchWhere,data:{printedAt: new Date().toISOString()}}))
  const users = (await payload.find({collection:"users",where:qsearchWhere}))
  return new Response(JSON.stringify(users))
}

export async function GET(request: NextRequest){
  const hasperm = await hasPermission("view:users") //TODO: maybe restrict permission
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
  const volunteerRoles = Object.entries(rolePermissions).filter(([,perms]) => perms.includes("view:volunteer")).map(([role]) => role)
  const users = (await payload.find({collection:"users", pagination:false, limit:0,sort:qsearchSort,where:qsearchWhere})).docs
  const positionOffsets = [
    {top:"0.49cm",  left:"4.14cm", height:"8.62cm", width:"12.72cm"},
    {top:"9.39cm",  left:"4.14cm", height:"8.62cm", width:"12.72cm"},
    {top:"18.29cm", left:"4.14cm", height:"8.62cm", width:"12.72cm"}]
  const commmonTextStyles: Style = {position:"absolute", width: "11.72cm", minHeight: "1cm", textAlign:"center"}
  const txtdbg = false
  const UserPDF = ({user, position}: {user:User, position:number} ) => (
    (user.name?.length ?? 0) > 0 &&
    <View style={{position:"absolute", ...positionOffsets[position]}} wrap={false} >
      {/*TeamNumberTop<Text debug={txtdbg} style={{position:"absolute",fontSize:"1rem",top:"1.9cm",left: "0.5cm",width: "4.1cm", textAlign:"left"}} hyphenationCallback={w => [w]}>Team #{user.team.number}</Text>*/}
      <Text debug={txtdbg} style={{...commmonTextStyles,top:"3.2cm",left: "0.5cm"}} hyphenationCallback={w => [w]}>{user.name}</Text>
      <QRCodeSVGPDF style={{position:"absolute",top:"5.31cm",left: "9.46cm"}} width={"29.5mm"} height={"29.5mm"} marginSize={4} value={`${serverurl}/user/${user.id}`}/>
    </View>
  )
  const usersfilter = (user:User) => (user);
  const blankusers = (n: number)=> Array(n).fill({id: ""}) as User[];
  const OutDoc = ({users, startPos = 0}:{ users:User[], startPos?:number}) => (
    <Document style={{fontFamily:"OpenSans", fontWeight: "medium"}}>
      { chunk(users.filter(usersfilter).toSpliced(0,0,...blankusers(startPos)),3).map((pageusers,idx) => (
        <Page key={idx} size="A4">
          {pageusers.map((user,idx) => <UserPDF key={user.id} user={user} position={idx}/>)}
        </Page>))}
    </Document>)

  const instance = pdf(<OutDoc users={users} startPos={startpos}/>);
  // const stream = await instance.toBuffer();
  // console.log(instance)
  // const stream = await renderToStream(<MyDocument />)
  // const b = await blob(stream)
  const b = await instance.toBlob()
  const response = new Response(b.stream())
  return response
}