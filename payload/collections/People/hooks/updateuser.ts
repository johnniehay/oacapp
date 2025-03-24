import type { CollectionAfterChangeHook } from "payload";
import { Person } from "@/payload-types";
import { peopleRoles } from "@/payload/collections/People";


export const updateuser: CollectionAfterChangeHook<Person> = async ({
                                                                  doc,
                                                                  previousDoc,
                                                                  req: { payload, context },
                                                                }) => {
  if (previousDoc.role !== doc.role) {
    if (doc.user) {
      const userid = typeof doc.user === "string" ? doc.user : doc.user.id;
      const userCurrent = await payload.findByID({collection:"users",id:userid, select:{role:true}})
      let updaterole = false
      if (userCurrent.role) {
        const userCurrentRoleIdx = peopleRoles.indexOf(userCurrent.role)
        const newRoleIdx = peopleRoles.indexOf(doc.role)
        if (newRoleIdx >= 0 && userCurrentRoleIdx >= 0 && newRoleIdx < userCurrentRoleIdx){
          updaterole = true
        }
      }
      if (updaterole) {
        await payload.update({ collection: "users", id: userid, data: { role: doc.role } })
      }

    }
  }
}
