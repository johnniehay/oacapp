"use server"

import { optionalAuthActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schemaDayVisitor = zfd.formData({
  name: z.string().max(50),
  minorOrAdult: z.union([z.literal('minor'), z.literal('adult')]),
  parent: z.string().max(50).optional(),
  phone: z.string().max(15).optional(),
  consent: z.literal("on"),
  parking: z.string().optional().transform((inpark,ctx) => {
    if (!inpark) return false
    if (inpark === "on") return true
    if (inpark === "off") return false
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid" });
    return z.NEVER
  }),
  setuser: z.union([z.literal('setup'), z.literal('registration')])
}).refine(({minorOrAdult,phone}) => minorOrAdult !== 'minor' || minorOrAdult === 'minor' && !!phone && phone.length !== 0,
  {
    path: ["phone"],
    message: "Parent Phone Number not provided",
  }).refine(({minorOrAdult,parent}) => minorOrAdult !== 'minor' || minorOrAdult === 'minor' && !!parent && parent.length !== 0,
  {
    path: ["parent"],
    message: "Parent/Guradian Name not provided",
  })


export const doCreateDayVisitor = optionalAuthActionClient
  .metadata({ actionName: "doCreateDayVisitor" })
  .schema(schemaDayVisitor)
  .action(async ({ parsedInput: { name, minorOrAdult, parent, phone, consent, parking, setuser }, ctx: { session, payload } }) => {
    const isAdult = minorOrAdult === 'adult'
    const additional_info = isAdult ? {isAdult, consent, parking} : {isAdult, parent, phone}
    const namepeople = await payload.find({collection:"people",depth:0,where:{name:{equals:name}}})
    // const isNamePeopleMe = namepeople.totalDocs === 1 && session?.user && namepeople.docs[0].user === session.user.id
    if (namepeople.totalDocs === 0) await payload.create({collection:"people", data:{name:name, role: "day_visitor", dietary_requirements: "None",special_needs:JSON.stringify(additional_info)}})
    else return {result: false, error: "There is already a registered person with this name"}
    if (parking) {
      const {dayvisitorparking} = await payload.findGlobal({slug:'eventconfig',select:{dayvisitorparking:true}})
      await payload.updateGlobal({slug:'eventconfig',data:{dayvisitorparking:dayvisitorparking+1}})
    }
    if (setuser === 'setup' && session?.user){
      const user = session.user
      const update_user_name = (name !== user.name) ? {name:name} : {}
      await payload.update({collection:"users",id:user.id,data:{role:"day_visitor", ...update_user_name}})
    }
    return {result: true}
  })