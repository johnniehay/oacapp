import { getLocalPayloadSession } from "@/lib/payload-authjs-custom/payload/session/getLocalPayloadSession"
import { getPayload } from "payload";
import config from '@payload-config'
import { Title } from "@mantine/core";
import { CalendarTimeGridOrList } from "@/app/(main_outer)/(main)/schedule/calendar";
// import { transformObject } from "@/lib/payload-authjs-custom/authjs/utils/transformObject";
import Calendar from "@event-calendar/core";
import { Event } from "@/payload-types"

type Args = {
  params: Promise<{
    teamnum: string
  }>
}

export default async function TeamSchedule({ params: paramsPromise }: Args) {
  const { teamnum } = await paramsPromise
  if (teamnum.length !== 3)
    return (<>Invalid Team Number</>)
  const session = await getLocalPayloadSession()
  const payload = await getPayload({config})
  const teamsearch = await payload.find({collection:"team",pagination:false,where:{number:{equals:teamnum}}})
  if (teamsearch.docs.length !== 1)
    return (<>Team Number({teamnum}) Not Found</>)
  const team = teamsearch.docs[0]
  const teamcalevents = team.events?.docs?.map((pevent) => {
    if (typeof pevent === "string" )
      return
    const {start, end, ...restpevent} = pevent
    return {start:new Date(start), end: new Date(end), ...restpevent}
    // return transformObject<Event,Calendar.Event>(pevent)
  }).filter((cevent) => !!cevent)
  return (<><Title order={1}>{teamnum} {team.name}</Title>
    {/*<pre className={"text-wrap"}>{JSON.stringify(team.events?.docs)}</pre>*/}
    <CalendarTimeGridOrList options={{
      view: "timeGridDay",
      duration: { days: 3 },
      date: "2025-05-07",
      slotMinTime: "08:00:00",
      slotMaxTime: "20:00:00",
      slotEventOverlap: false,
      slotDuration: "00:10:00",
      events: teamcalevents,
      headerToolbar:{start: 'title', center: 'timeGridDay listDay', end: 'today prev,next'},
      nowIndicator: true
    }}/>
  </>)
}