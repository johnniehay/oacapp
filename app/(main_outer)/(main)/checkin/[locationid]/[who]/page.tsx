import { getPayload } from "payload";
import configPromise from '@payload-config'
import { getLocalPayloadSession } from "@/lib/payload-authjs-custom/payload/session/getLocalPayloadSession";
import { hasPermission } from "@/lib/permissions";
import { checkin } from "@/lib/checkin";
import { redirect } from "next/navigation";

type Args = {
  params: Promise<{
    locationid: string
    who: Who | string
  }>
}

const wholist = ['team','person','volunteer'] as const
export type Who = typeof wholist[number]
function isWho(inputwho: Who | string): inputwho is Who {
  return !!inputwho && (wholist as readonly string[]).includes(inputwho)
}


function nullifID<T>(value: T|string): T|null {
  return (typeof value === 'string') ? null : value
}


export default async function Checkin({ params: paramsPromise }: Args) {
  const { locationid, who } = await paramsPromise
  if (!locationid || locationid.length !== 24) return <h1>Invalid location</h1>
  if (!isWho(who)) return <h1>Invalid who</h1>

  const session = await getLocalPayloadSession()
  if (!session) return <h1>Unauthorized to check in when not signed in</h1>
  const payload = await getPayload({ config: configPromise })
  const location = await payload.findByID({collection:"location",id:locationid,depth:1,disableErrors:true})
  if (!location) return <h1>Location not found</h1>
  const user = session.user
  const isVolunteer = await hasPermission("view:volunteer")
  const { docs: people, totalDocs} = await payload.find({collection:"people",depth:1,where:{user:{equals:user.id}}})
  if (people.length === 0 && !(who === 'volunteer' && isVolunteer)) return <h1>Linked Person not found</h1>
  const person = people.length === 1 ? people[0] : null
  const team = nullifID(person?.team) ?? null
  if (people.length <= 1) {
    const checkedin = await checkin({ who:who, locationid: location.id, teamid: team?.id, personid: person?.id })
    if ("error" in checkedin) return <h1>Checkin failed: {checkedin.error}</h1>
    redirect(`/checkin/success/${checkedin.checkin.id}`)
  }


}