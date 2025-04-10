"use server"

import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { hasPermissionReq } from "@/lib/permissions-payload";
import { coachteamsquery } from "@/payload/collections/People/index";
import { redirect } from "next/navigation";
import { flattenValidationErrors } from "next-safe-action";

export const mergePeople = authActionClient
  .metadata({ actionName: "mergePeople" })
  .schema(z.array(z.string()), {handleValidationErrorsShape: async (ve, utils) => flattenValidationErrors(ve).fieldErrors})
  .action(async ({ parsedInput: mergepeopleids, ctx: { user, payload } }) => {
    console.log("merge",mergepeopleids)
    const hasRolePerm = hasPermissionReq("update:people",user) && hasPermissionReq("remove:people",user)
    const coachteamids = await coachteamsquery(user, payload) as string[]
    if (!hasRolePerm && coachteamids.length === 0)
      return {error:"Unauthorized"}
    const mwhere = {id:{in:mergepeopleids.join(',')}}
    const qwhere = hasRolePerm ? mwhere : {and:[mwhere,{team:{in:coachteamids.join(',')}}]}
    const mergepeople = (await payload.find({collection:"people",depth:0,where:qwhere})).docs
    if (mergepeople.length !== 2) return {error:"Select 2 valid people to merge"}
    console.log("Merging people",mergepeople)
    const [p1,p2] = mergepeople
    const [basep, remp] = new Date(p1.createdAt) < new Date(p2.createdAt) ? [p1,p2] : [p2,p1]
    console.log("Merging base",basep,"rem", remp)
    if (basep.user && remp.user && basep.user !== remp.user) return {error:"Two people with linked users can't be merged"}
    const ifeqelsecomb = <A extends string|null|undefined>(a: A, b: A) => a === b ? a : (a && b) ? a + b : a ?? b;
    const updata: Omit<typeof p1,"id"|"createdAt"|"updatedAt"> = {
      name: ifeqelsecomb(basep.name, remp.name),
      team: basep.team ?? remp.team,
      user: basep.user ?? remp.user,
      role: basep.role.includes("candidate") ? (remp.role.includes("candidate") ? basep.role : remp.role) : basep.role, //prefer non-candidate
      dietary_requirements: basep.dietary_requirements, // what if mismatch
      allergies_and_other: ifeqelsecomb(basep.allergies_and_other,remp.allergies_and_other),
      special_needs: ifeqelsecomb(basep.special_needs,remp.special_needs),
    }
    console.log("Merging updata", updata) //TODO: reduce logging
    await payload.update({collection:"people", id:basep.id, data:updata});
    await payload.delete({collection:"people",id:remp.id});
    redirect(`/admin/collections/people/${basep.id}`)
  })