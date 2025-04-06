import { BasePayload, CollectionConfig, DefaultValue, FilterOptions, PayloadRequest, Where } from "payload";
import { checkConditionPermission, checkPermissionOrWhere } from "@/payload/access/checkPermission";
import { updateuser } from "@/payload/collections/People/hooks/updateuser";
import snakeCase from "lodash/snakeCase";
import { getRoleFromUser, type UserWithIdRole } from "@/lib/get-role";

export const peopleRoleOptions =[
  {label:"Coach",value:"coach"},
  {label:"Mentor",value:"mentor"},
  {label:"Team Member",value:"team_member"},
  {label:"Supporter",value:"supporter"},
  {label:"Translator",value:"translator"},
  {label:"Candidate Coach",value:"candidate-coach"},
  {label:"Candidate Mentor",value:"candidate-mentor"},
  {label:"Candidate Team Member",value:"candidate-member"},
  {label:"Candidate Supporter",value:"candidate-supporter"},
  {label:"Candidate Translator",value:"candidate-translator"},
  {label:"Affiliated",value:"affiliated"},
];

export const peopleRoles = peopleRoleOptions.map((roleoption) => roleoption.value)

const volunteerRolesLabels = ["Judge", "Referee", "Other Volunteer"]
export const volunteerRoleOptions = volunteerRolesLabels.map(role => {return {label: role, value: snakeCase(role)}});
export const volunteerRoles = volunteerRolesLabels.map(role => snakeCase(role));

export const dietaryOptions = ["None","Halal","Kosher","Vegetarian","Vegan","Other"]

export const coachteamsquery = async (user: UserWithIdRole | null | undefined, payload: BasePayload)=> {
  if (getRoleFromUser(user) === "coach") {
    const teams = (await payload.find({
      collection: "people",
      select: { team: true },
      depth:0,
      where: { and: [{ user: { equals: user?.id } }, { role: { equals: "coach" } }] }
    })).docs
    return teams.map(t => t.team)
  } else {
    return []
  }
}

const coachteams = async (payloadreq: PayloadRequest) => {
  return coachteamsquery(payloadreq.user, payloadreq.payload)
}

export const wherecoach = async (payloadreq: PayloadRequest) => {
  if (getRoleFromUser(payloadreq.user) === "coach") {
    const teamids = await coachteams(payloadreq)
    if (teamids.length === 0) return false
    return {team:{in:teamids.join(",")}} as Where
  } else {
    return false
  }
}

const teamwherecoach: FilterOptions = async ({req: payloadreq, user}) => {
  return teamwherecoachReq(payloadreq)
}

export const teamwherecoachReq = async (payloadreq: PayloadRequest) => {
  if (getRoleFromUser(payloadreq.user) === "coach") {
    const teamids = await coachteams(payloadreq)
    if (teamids.length === 0) return false
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
    {name:"name",type:"text",label:"Name",required:true, admin:{description: "Name that will be printed on lanyard"}},
    {name:"user",type:"relationship",relationTo:"users",required:false, admin:{condition:checkConditionPermission("view:people")}},
    {name:"team",type:"relationship",relationTo:"team",required:false, defaultValue:defaultteam, filterOptions:teamwherecoach},
    {name:"role",type:"select",required:true,options:peopleRoleOptions,interfaceName:"peopleRole"},
    {name:"dietary_requirements", label:"Dietary Requirements", type:"select",required:true,options:dietaryOptions,interfaceName:"dietaryOption",admin:{description:"For food provided during cultural night. For Other please specify below."}},
    {name:"allergies_and_other", label:"Allergies and Other Dietary Requirements", type:"text"},
    {name:"special_needs",label:"Special Needs and Disabilities",type:"text", admin:{description: 'Any special needs or conditions that volunteers/judges needs to be aware of such as students with autism, or speech disorders. Add "difficulty walking" for anyone unable to make the 1.5km walk to the aquarium.'}},
  ],
  hooks:{
    afterChange: [updateuser]
  }
}