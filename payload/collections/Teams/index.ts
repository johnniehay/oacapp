import type { CollectionConfig } from "payload";
import { anyone } from "@/payload/access/anyone";
import {
  checkFieldPermission,
  checkFieldPermissionOrIf,
  checkPermission,
  checkPermissionOrWhere
} from "@/payload/access/checkPermission";
import { coachteamsquery, teamwherecoachReq } from "@/payload/collections/People";
import { Permission } from "@/lib/roles";

const viewonlyunlesspermission = {
  create: checkFieldPermission("create:team"),
  read: () => true,
  update: checkFieldPermission("update:team"),
}

const checkFieldPermissionOrCoach = (permission: Permission) => checkFieldPermissionOrIf(permission,async (args) => {
    const { id, req: { user, payload } } = args
    // console.log("shared_contact update access", user?.role,getRoleFromUser(user), id, doc?.id)
    if (id === undefined) return true //not necessary to check coach as just a pre-check
    const teamids = await coachteamsquery(user, payload)
    // console.log("shared_contact update access teamids", teamids)
    if (typeof id !== "string") {
      console.log("Got id as %s in Teams shared_contact update access", typeof id, id)
      return false
    }
    return teamids.includes(id);
  })

const viewonlybutcoachupdateable = {
  ...viewonlyunlesspermission,
  update: checkFieldPermissionOrCoach("update:team"),
}

const viewteamdetailsbutcoachupdateable = {
  create: checkFieldPermission("create:team"),
  read: checkFieldPermissionOrCoach("view:team:details"),
  update: checkFieldPermissionOrCoach("update:team"),
}

export const Teams: CollectionConfig<"team"> = {
  slug: "team",

  access: {
    create: checkPermission("create:team"),
    delete: checkPermission("remove:team"),
    read: anyone,
    update: checkPermissionOrWhere("update:team",teamwherecoachReq),
  },
  admin: {useAsTitle:"name"},
  fields:[
    { name:"number", type:"text", required:true,unique:true, access:viewonlyunlesspermission },
    { name:"name", type:"text", required:true, unique:true, access:viewonlyunlesspermission },
    { name:"country", type:"text", access:viewonlyunlesspermission },

    { name:"shared_contact", label:"Team contact details visible to other Teams", type:"text",
      admin:{description:"Contact information that other teams can use to get touch with you such as a team email or social-media page/handle"},
      access:viewonlybutcoachupdateable,
    },
    { name: "parking_req", label: "Number of parking bays required", type: "number",
      admin:{description:"Enter 0 if no parking required. Cost(low) will be communicated"},access:viewteamdetailsbutcoachupdateable },
    { name:"people", type:"join", collection:"people", on:"team", defaultLimit:0, admin:{defaultColumns:["name","role"]}},
    { name:"events", type:"join", collection:"event", on:"teams", defaultLimit:0},
  ]
}