import { getPayload } from "payload";
import config from "@payload-config";
import type { Event, Location} from "@/payload-types"
import { Title } from "@mantine/core";
import { CalendarResourceTimeGridOrLine } from "@/app/(main_outer)/(main)/schedule/calendar";
import "./allteams.css"

const eventTitleToShortAbbrMap:{[key: string]: string} = { // refences to match lib/import-teams-events-csv.ts and form match option
  "Robot Game Round 1": "1",
  "Robot Game Round 2": "2",
  "Robot Game Round 3": "3",
  "Robot Game Practice Round 1": "P1",
  "Robot Game Practice Round 2": "P2",
  "Robot Game Alliance Round": "A",
  "Judging":"J",
  "Queue for Robot Game Round 1": "Q1",
  "Queue for Robot Game Round 2": "Q2",
  "Queue for Robot Game Round 3": "Q3",
  "Queue for Robot Game Practice Round 1": "QP1",
  "Queue for Robot Game Practice Round 2": "QP2",
  "Queue for Robot Game Alliance Round": "QA",
  "Queue for Judging":"QJ"
}

export default async function AllteamsSchedule({searchParams}: { searchParams: Promise<{days?: string,queue?: string}> }) {
  const {days:daysstr="1", queue:showqueue} = await searchParams
  let days
  try {
    days = parseInt(daysstr)
    days = days > 3 ? 3 : days
    days = days < 1 ? 1 : days
  } catch (error) {
    days = 1
  }
  // const session = await getLocalPayloadSession()
  const payload = await getPayload({config})
  // const judgingrooms = (await payload.find({collection:"location",pagination:false,sort:"abbreviation",where:{location_type:{equals:"judging"}}})).docs
  // const robotgametables = (await payload.find({collection:"location",pagination:false,sort:"abbreviation",where:{location_type:{equals:"robotgame"}}})).docs
  const dbteams = (await  payload.find({collection:"team",pagination:false,sort:"number"})).docs
  const events = (await payload.find({collection:"event",pagination:false,where:{eventType:{in:"judging,robotgame"+(showqueue?",judging-queue,robotgame-queue":"")}}})).docs
  // const resources = [...judgingrooms,...robotgametables].map(r => {
  //   return {id: r.id, title:r.abbreviation}
  // })
  const resources = dbteams.map(t => {return {id: t.id, title:t.number}})
  const calevents = events.map((pevent) => {
    if (typeof pevent === "string" )
      return
    const {start, end, title, ...restpevent} = pevent
    const {location, teams: teamsOrStr} = restpevent
    if ( !location || typeof location === "string" ) throw("string location in JudgingSchedule")
    if ( !teamsOrStr ) throw("no teams in JudgingSchedule")
    if ( !teamsOrStr.every((team) => typeof team !== "string") ) throw("string team in JudgingSchedule")
    const teams = teamsOrStr
    const teamsIds = teams.map((team) => team.id)
    const eventresources = [location.id, ...teamsIds]
    const eventtitle = eventTitleToShortAbbrMap[title] +" "+ (typeof pevent.location !== "string" ? pevent.location?.abbreviation.slice(pevent.location?.abbreviation.length-1) : "")
    const additfields = {teamnames: teams.map(t => t.name).join(" ")}
    return {start:new Date(start), end: new Date(end), resourceIds:eventresources, title:eventtitle, extendedProps:{title,eventtitle, ...restpevent,...additfields}}
    // return transformObject<Event,Calendar.Event>(pevent)
  }).filter((cevent) => !!cevent)
  return (<><Title order={1}>All Teams Schedule</Title>
    {/*<pre className={"text-wrap"}>{JSON.stringify(team.events?.docs)}</pre>*/}
    {/*<CalendarResourceTimeline options={{*/}
    <CalendarResourceTimeGridOrLine options={{
      // view: "resourceTimelineDay",
      view: "resourceTimeGridDay",
      duration: { days: days },
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
      eventContentServer: 'titleonly',
      eventClickServer: "teaminfo",
      // eventContent: {html:`<p>001 Test team name</p>`},
      displayEventEnd:false,
      allDaySlot: false,
      nowIndicator: true,
    }}/>
  </>)
}