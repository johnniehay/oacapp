"use server"

import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { peopleRoles, volunteerRoles } from "@/payload/collections/People";
import { PeopleRole } from "@/payload-types";
import { zfd } from "zod-form-data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectFromArrayByKey<T extends Record<string, any>>(ar:T[],k: keyof T): Record<string, T> {
  return ar.reduce((newob:Record<string, T>,el) => {
      newob[el[k]] = el
      return newob
    },{})
}

const schemaUserSetup = zfd.formData({
  user_name: z.string().min(1).max(100),
  roleGroup: z.string().max(15),
  role: z.string().transform((inrole, ctx) => {
    if (!inrole || inrole.length === 0) {
      console.log("Got empty role");
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required" });
      return z.NEVER
    }
    if (!(peopleRoles.includes(inrole)) && !(volunteerRoles.includes(inrole))) {
      console.log("Got role",inrole, "not in", peopleRoles, volunteerRoles);
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "not in peopleRoles or volunteerRoles" });
      return z.NEVER
    }
    return `candidate-${inrole}` as PeopleRole
  }),
  teamids: z.string().transform((teamscsv,) => teamscsv.split(","))
})

export const doUserSetup = authActionClient
  .metadata({ actionName: "doUserSetup" })
  .schema(schemaUserSetup)
  .action(async ({ parsedInput: { user_name, roleGroup, role, teamids }, ctx: { user, payload } }) => {
    console.log("doUserSetup",{roleGroup,role,teamids});
    const isVolunteer = roleGroup === "volunteer"
    const userpeople = await payload.find({collection:"people",depth:0,where:{user:{equals:user.id}}})
    const userpeoplebyteam = objectFromArrayByKey(userpeople.docs,"team")
    for (const teamid of teamids) {
      if (!(teamid in userpeoplebyteam)) {
        await payload.create({collection:"people", data:{name:user_name, user:user.id, team:teamid,role: isVolunteer?"affiliated":role}})
      }
    }
    const update_user_name = (user_name !== user.name) ? {name:user_name} : {}
    await payload.update({collection:"users",id:user.id,data:{role:role, ...update_user_name}})
    return {result:"done"}
  })

// specifically unsafe as it calls the safe-action above
export const doformAction = async (formdata: FormData) => {
  "use server";
  console.log("formdata",formdata)
  const res = await doUserSetup(formdata)
  const logObject: Record<string, unknown> = { form:"doformAction(setup)", formdata ,result:res };
  console.dir(logObject,{depth:null})
  if (res && "validationErrors" in res && res.validationErrors) {
    // Object.entries(res.validationErrors).map(([fieldname,fieldval]) => console.dir(fieldname, (typeof fieldval === "object") ? fieldval?._errors : fieldval) )

  }
  return res
}