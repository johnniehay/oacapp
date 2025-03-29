import { CollectionConfig, DefaultValue, FilterOptions, PayloadRequest, Where } from "payload";
import { checkConditionPermission, checkPermissionOrWhere } from "@/payload/access/checkPermission";
import { updateuser } from "@/payload/collections/People/hooks/updateuser";
import snakeCase from "lodash/snakeCase";
import { getRoleFromUser } from "@/lib/get-role";

export const peopleRoleOptions =[
  {label:"Coach",value:"coach"},
  {label:"Mentor",value:"mentor"},
  {label:"Team Member",value:"team_member"},
  {label:"Supporter",value:"supporter"},
  {label:"Candidate Coach",value:"candidate-coach"},
  {label:"Candidate Mentor",value:"candidate-mentor"},
  {label:"Candidate Team Member",value:"candidate-member"},
  {label:"Candidate Supporter",value:"candidate-supporter"},
  {label:"Affiliated",value:"affiliated"},
];

export const peopleRoles = peopleRoleOptions.map((roleoption) => roleoption.value)

const volunteerRolesLabels = ["Judge", "Referee", "Other Volunteer"]
export const volunteerRoleOptions = volunteerRolesLabels.map(role => {return {label: role, value: snakeCase(role)}});
export const volunteerRoles = volunteerRolesLabels.map(role => snakeCase(role));

const coachteams = async (payloadreq: PayloadRequest) => {
  if (getRoleFromUser(payloadreq.user) === "coach") {
    const teams = (await payloadreq.payload.find({
      collection: "people",
      select: { team: true },
      depth:0,
      where: { and: [{ user: { equals: payloadreq.user?.id } }, { role: { equals: "coach" } }] }
    })).docs
    return teams.map(t => t.team)
  } else {
    return []
  }
}


const wherecoach = async (payloadreq: PayloadRequest) => {
  if (getRoleFromUser(payloadreq.user) === "coach") {
    const teamids = await coachteams(payloadreq)
    return {team:{in:teamids.join(",")}} as Where
  } else {
    return false
  }
}

const teamwherecoach: FilterOptions = async ({req: payloadreq, user}) => {
  if (getRoleFromUser(user) === "coach") {
    const teamids = await coachteams(payloadreq)
    return {id:{in:teamids.join(",")}} as Where
  } else {
    return true
  }
}

const defaultteam: DefaultValue =  async ({req: payloadreq, user}) => {
  if (getRoleFromUser(user) === "coach") {
    const teamids = await coachteams(payloadreq)
    if (teamids.length === 1) {
      return teamids[0]
    }
    return undefined
  } else {
    return undefined
  }
}

export const People: CollectionConfig<"people"> = {
  slug: "people",
  access: {
    create: checkPermissionOrWhere("create:people",wherecoach),
    delete: checkPermissionOrWhere("remove:people",wherecoach),
    read: checkPermissionOrWhere("view:people",wherecoach),
    update: checkPermissionOrWhere("update:people",wherecoach),
  },
  admin: {
    useAsTitle:"name",
  },
  fields:[
    {name:"name",type:"text",label:"Name",required:true},
    {name:"user",type:"relationship",relationTo:"users",required:false, admin:{condition:checkConditionPermission("view:people")}},
    {name:"team",type:"relationship",relationTo:"team",required:false, defaultValue:defaultteam, filterOptions:teamwherecoach},
    {name:"role",type:"select",required:true,options:peopleRoleOptions,interfaceName:"peopleRole"}],
  hooks:{
    afterChange: [updateuser]
  }
}