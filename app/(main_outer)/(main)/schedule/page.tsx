import { CalendarList, CalendarTimeGrid, CalendarTimeGridOrList } from "@/app/(main_outer)/(main)/schedule/calendar";
import dayProgrammeEvents from "@/app/(main_outer)/(main)/schedule/day-programme-events";
import { Title } from "@mantine/core";

// const events = [{start: "2025-02-23 01:33:00",end: "2025-02-23 01:40:00"}];
export default function ScheduleHome() {
  return (<>
    <Title order={2}>Preliminary General Schedule</Title>
    All times shown in SAST(South African Standard Time)
    <CalendarTimeGridOrList options={{
      view: "timeGridDay",
      duration: { days: 3 },
      date: "2025-05-07",
      slotMinTime: "08:00:00",
      slotMaxTime: "21:00:00",
      slotEventOverlap: false,
      slotDuration: "00:30:00",
      validRange:{start:"2025-05-07",end:"2025-05-09"},
      events: dayProgrammeEvents,
      headerToolbar:{start: 'title', center: 'timeGridDay listDay', end: 'today prev,next'},
      allDaySlot: false,
      nowIndicator: true
    }}
    overrideDaysOnWidth={true}
    />
    {/*<CalendarList options={{*/}
    {/*  view: "listDay",*/}
    {/*  duration: { days: 3 },*/}
    {/*  date: "2025-05-07",*/}
    {/*  slotMinTime: "08:00:00",*/}
    {/*  slotMaxTime: "20:00:00",*/}
    {/*  slotEventOverlap: false,*/}
    {/*  slotDuration: "00:30:00",*/}
    {/*  events: dayProgrammeEvents,*/}
    {/*  nowIndicator: true*/}
    {/*}}/>*/}
  </>)
}