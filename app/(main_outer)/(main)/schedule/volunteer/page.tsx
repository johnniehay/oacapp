import { CalendarTimeGridOrList } from "@/app/(main_outer)/(main)/schedule/calendar";
import { Title } from "@mantine/core";
import { getPayload } from "payload";
import configPromise from '@payload-config'

// const events = [{start: "2025-02-23 01:33:00",end: "2025-02-23 01:40:00"}];
export default async function VolunteerSchedule() {
  const payload = await getPayload({config:configPromise});
  const generalteamevents = (await payload.find({collection:"event",pagination:false,depth:1,where:{eventType:{equals:"general"},forAll:{equals:"volunteers"}}})).docs
  const calevents = generalteamevents.map((pevent) => {
    if (typeof pevent === "string" )
      return
    const {start, end, title, ...restpevent} = pevent
    const {location} = restpevent
    if ( !location || typeof location === "string" ) throw("string location in JudgingSchedule")
    const eventresources = [location.id]
    return {start:new Date(start), end: new Date(end), resourceIds:eventresources, title:title, extendedProps:{title, teams:[], ...restpevent}}
  }).filter((cevent) => !!cevent)

  return (<>
    <Title order={2}>Preliminary Volunteer Schedule</Title>
    All times shown in SAST(South African Standard Time)
    <CalendarTimeGridOrList options={{
      view: "timeGridDay",
      duration: { days: 3 },
      date: "2025-05-07",
      slotMinTime: "08:00:00",
      slotMaxTime: "21:00:00",
      slotEventOverlap: false,
      slotDuration: "00:30:00",
      validRange:{start:"2025-05-05",end:"2025-05-09"},
      events: calevents,
      headerToolbar:{start: 'title', center: 'timeGridDay listDay', end: 'today prev,next'},
      eventClickServer: "teaminfo",
      allDaySlot: false,
      nowIndicator: true
    }}
    overrideDaysOnWidth={true}
    />
  </>)
}