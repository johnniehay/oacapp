import type { Who } from "@/app/(main_outer)/(main)/checkin/[locationid]/[who]/page";
import { getPayload } from "payload";
import configPromise from '@payload-config'
import { hasPermission } from "@/lib/permissions";
import { getLocalPayloadSession } from "@/lib/payload-authjs-custom/payload/session/getLocalPayloadSession";

export function asNotID<T>(value: T|string): T {
  if (typeof value === 'string') throw new Error(`${value} is a string`)
  return value
}

export async function checkin( {who,locationid, teamid, personid} : {who: Who,locationid: string, teamid?: string, personid?: string} ) {
  const payload = await getPayload({ config: configPromise })
  const userid = (await getLocalPayloadSession())?.user.id
  switch (who) {
    case 'team':
      if (!teamid) return { error: "This is a team-only checkin code and you do not appear to be a part of a team" };
      break
    case 'person':
      if (!personid) return { error: "This is a person-only checkin code and you do not appear to be a registered person" };
      break
    case 'volunteer':
      const isVolunteer = await hasPermission("view:volunteer")
      if (!isVolunteer) return { error: "This is a volunteer-only checkin code and you do not appear to be a Volunteer" };
      break
    default:
      const exhaustiveCheck: never = who
      throw new Error(`Unhandled case: ${exhaustiveCheck}`)
  }
  // TODO: deduplicate check recent or once
  const checkindata = await payload.create({collection:"checkin", data:{location:locationid,who,team:teamid,person:personid, user:userid}, depth:1})
  return { checkin: checkindata }
}