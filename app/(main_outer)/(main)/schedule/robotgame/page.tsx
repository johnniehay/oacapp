import { getPayload } from "payload";
import config from "@payload-config";
import { Title } from "@mantine/core";
import { CalendarResourceTimeGridOrLine } from "@/app/(main_outer)/(main)/schedule/calendar";

export default async function RobotgameSchedule() {
  // const session = await getLocalPayloadSession()
  const payload = await getPayload({config})
  const robotgametables = (await payload.find({collection:"location",pagination:false,sort:"abbreviation",where:{location_type:{equals:"robotgame"}}})).docs
  const events = (await payload.find({collection:"event",pagination:false,where:{eventType:{equals:"robotgame"}}})).docs
  const resources = robotgametables.map(r => {
    return {id: r.id, title:r.abbreviation}
  })
  const calevents = events.map((pevent) => {
    if (typeof pevent === "string" )
      return
    const {start, end, title, ...restpevent} = pevent
    const {location, teams: teamsOrStr} = restpevent
    if ( !location || typeof location === "string" ) throw("string location in RobotgameSchedule")
    if ( !teamsOrStr ) throw("no teams in RobotgameSchedule")
    if ( !teamsOrStr.every((team) => typeof team !== "string") ) throw("string team in RobotgameSchedule")
    const teams = teamsOrStr
    const teamsIds = teams.map((team) => team.id)
    const eventresources = [location.id, ...teamsIds]
    const eventtitle = teams.map(t => t.number).join(" ")
    const additfields = {teamnames: teams.map(t => t.name).join(" ")}
    return {start:new Date(start), end: new Date(end), resourceIds:eventresources, title:eventtitle, extendedProps:{title, ...restpevent,...additfields}}
    // return transformObject<Event,Calendar.Event>(pevent)
  }).filter((cevent) => !!cevent)
  return (<><Title order={1}>Robotgame Schedule</Title>
    {/*<pre className={"text-wrap"}>{JSON.stringify(team.events?.docs)}</pre>*/}
    {/*<CalendarResourceTimeline options={{*/}
    <CalendarResourceTimeGridOrLine options={{
      // view: "resourceTimelineDay",
      view: "resourceTimeGridDay",
      duration: { days: 1 },
      date: "2025-05-07",
      slotMinTime: "08:00:00",
      slotMaxTime: "17:00:00",
      slotEventOverlap: false,
      slotDuration: "00:10:00",
      validRange:{start:"2025-05-07",end:"2025-05-09"},
      events: calevents,
      resources: resources,
      headerToolbar:{start: 'title', center: 'resourceTimelineDay resourceTimeGridDay', end: 'today prev,next'},
      slotLabelInterval: 0,
      eventContentServer: 'titlewithteamnames',
      eventClickServer: "teaminfo",
      // eventContent: {html:`<p>001 Test team name</p>`},
      displayEventEnd:false,
      allDaySlot: false,
      nowIndicator: true,
    }}/>
  </>)
}