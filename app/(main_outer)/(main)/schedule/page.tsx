import {CalendarList, CalendarTimeGrid} from "@/app/(main_outer)/(main)/schedule/calendar";
import dayProgrammeEvents from "@/app/(main_outer)/(main)/schedule/day-programme-events";

// const events = [{start: "2025-02-23 01:33:00",end: "2025-02-23 01:40:00"}];
export default function ScheduleHome(){
    return (<>
        <CalendarTimeGrid options={{
        view: "timeGridDay",
        duration: {days:3},
        date:"2025-05-07",
        slotMinTime:"08:00:00",
        slotMaxTime:"20:00:00",
        slotEventOverlap:false,
        slotDuration:"00:30:00",
        events:dayProgrammeEvents,
        nowIndicator: true}}/>
        <CalendarList options={{
        view: "listDay",
        duration: {days:3},
        date:"2025-05-07",
        slotMinTime:"08:00:00",
        slotMaxTime:"20:00:00",
        slotEventOverlap:false,
        slotDuration:"00:30:00",
        events:dayProgrammeEvents,
        nowIndicator: true}}/>
    </>)
}