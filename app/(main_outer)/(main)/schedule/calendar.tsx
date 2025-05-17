"use client"

import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import CalList from '@event-calendar/list';
import ResourceTimeline from '@event-calendar/resource-timeline';
import ResourceTimeGrid from '@event-calendar/resource-time-grid';

import '@event-calendar/core/index.css';
import '@/app/(main_outer)/(main)/schedule/calendar.css';
// import {SvelteComponent} from "svelte";
import { ReactNode, useContext, useLayoutEffect, useRef, useState } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Team, Location } from "@/payload-types";
import { Group, Modal, Stack } from "@mantine/core";
import { lightFormat } from "date-fns";

// function SvelteWrapper<ComponentType>(Component: SvelteComponent) {
//   return (props: ComponentType.ComponentProps) => {
//     const svelteRef = useRef<ComponentType|null>(null);
//     useLayoutEffect(() => {
//       while (svelteRef.current?.firstChild) {
//         svelteRef.current?.firstChild?.remove();
//       }
//       new Component({
//         target: svelteRef.current,
//         props,
//       });
//     }, []);
//     return <div ref={svelteRef}></div>;
//   };
// }


export function BaseCalendarComponent(props: Calendar.ComponentProps) {
  const svelteRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<Calendar>(null);
  useLayoutEffect(() => {
    // while (svelteRef.current?.firstChild) {
    //   svelteRef.current?.firstChild?.remove();
    // }
    if (svelteRef?.current !== null) {
      calRef.current = new Calendar({
        target: svelteRef.current,
        props,
      });
    }
    console.log("CalendarComponent useLayoutEffect");
    return () => {
      calRef.current?.destroy()
    }
  }, [props]);
  // const SvelteCalendar = SvelteWrapper<Calendar>(Calendar);

  return (<div ref={svelteRef}></div>)
}

const eventContentServerMapKeys = ["titleonly","titlewithteamnames"] as const;
type EventContentServerMapKey = typeof eventContentServerMapKeys[number]

const eventContentServerMap: Record<EventContentServerMapKey,((info: Calendar.EventContentInfo) => (Calendar.Content | undefined))> = {
  titleonly: ({event}) => {console.log(event.extendedProps); return {html:`<p class="break-all overflow-hidden">${event.title}</p>`}},
  titlewithteamnames: ({event, view}) => {
    const teamnames = view.type.includes("Timeline") ? "" : " "+event.extendedProps.teamnames
    return {html:`<p class="break-all overflow-hidden">${event.title}${teamnames}</p>`}}
}

const eventClickServerMapKeys = ["teaminfo"] as const;
type EventClickServerMapKey = typeof eventClickServerMapKeys[number]
const eventClickServerMap: Record<EventClickServerMapKey,((setModalContent: ((modalcontent: ReactNode, view?:string, date?: Date) => void),info: Calendar.EventClickInfo) => void)> = {
  teaminfo: (setModalContent,{event, view}) => {
    const eprops = event.extendedProps as {teams: Team[],location: Location, title: string }
    const teams = eprops.teams
    const teamgrp = <Group>{teams.map(team => <div key={team.id}>{team.number} {team.name} ({team.country})</div>)}</Group>
    setModalContent(<Stack>
      {eprops.title}
      <p>{lightFormat(event.start,"HH:mm")} - {lightFormat(event.end,"HH:mm")}</p>
      {teamgrp}
      <p>{eprops.location.name}</p>
      <p>Room: {eprops.location.room}</p>
      <p>Floor: {eprops.location.floor}</p>
    </Stack>,view.type,view.currentStart)
  }
}

interface additionalCalendarOptions {
  validRange?: { start: string, end: string };
  slotLabelInterval?: Calendar.DurationInput;
  eventContentServer?: EventContentServerMapKey;
  eventClickServer?: EventClickServerMapKey;
}

type BaseCalendarComponentProps = Calendar.ComponentProps & { options: additionalCalendarOptions }
type CalendarOptionsProps = Omit<BaseCalendarComponentProps, "plugins">

export function CalendarComponent(props: BaseCalendarComponentProps) {
  const modalContent = useRef<ReactNode>(<></>)
  const [opened, { open, close }] = useDisclosure(false);
  const [view, setView] = useState(props.options.view)
  const [date, setDate] = useState(props.options.date)
  const { options: {eventContentServer, eventClickServer} } = props;
  if (eventContentServer && (eventContentServerMapKeys as readonly string[]).includes(eventContentServer)) {
    props.options.eventContent = eventContentServerMap[eventContentServer]
  }
  function setModalContentAndOpen(modalcontent:ReactNode, view?:string, date?:Date):void {
    modalContent.current = modalcontent
    setView(view)
    setDate(date)
    open()

  }
  if (eventClickServer && (eventClickServerMapKeys as readonly string[]).includes(eventClickServer)) {
    props.options.eventClick = eventClickServerMap[eventClickServer].bind(null,setModalContentAndOpen)
  }
  props.options.view = view
  props.options.date = date
  return (<>
    <BaseCalendarComponent {...props}/>
    <Modal opened={opened} onClose={close} title={"Event"}>
      {modalContent.current}
    </Modal>
  </>)
}

export function CalendarTimeGrid(props: CalendarOptionsProps) {
  return (<CalendarComponent plugins={[TimeGrid]} {...props}/>)
}

export function CalendarList(props: CalendarOptionsProps) {
  return (<CalendarComponent plugins={[CalList]} {...props}/>)
}

export function CalendarResourceTimeline(props: CalendarOptionsProps) {
  return (<CalendarComponent plugins={[ResourceTimeline]} {...props}/>)
}

export function CalendarResourceTimeGrid(props: CalendarOptionsProps) {
  const { options: {eventContentServer} } = props;
  if (eventContentServer && (eventContentServerMapKeys as readonly string[]).includes(eventContentServer)) {
    props.options.eventContent = eventContentServerMap[eventContentServer]
  }
  return (<CalendarComponent plugins={[ResourceTimeGrid]} {...props}/>)
}

export function CalendarResourceTimeGridOrLine(props: CalendarOptionsProps) {
  const { options: {eventContentServer} } = props;
  if (eventContentServer && (eventContentServerMapKeys as readonly string[]).includes(eventContentServer)) {
    props.options.eventContent = eventContentServerMap[eventContentServer]
  }
  return (<CalendarComponent plugins={[ResourceTimeGrid,ResourceTimeline]} {...props}/>)
}

export function CalendarTimeGridOrList(props: CalendarOptionsProps & {overrideDaysOnWidth?: boolean}) {
  const { options: {eventContentServer} } = props;
  if (eventContentServer && (eventContentServerMapKeys as readonly string[]).includes(eventContentServer)) {
    props.options.eventContent = eventContentServerMap[eventContentServer]
  }
  const {overrideDaysOnWidth, ...origprops} = props
  // const mqarr = overrideDaysOnWidth?.entries().map(mqstr => useMediaQuery(mqstr,false) )
  const mqsingle = useMediaQuery('(max-width: 500px)',false)
  const mqdouble = useMediaQuery('(max-width: 700px) and (min-width: 500px)',false)
  const overriddenoptions = overrideDaysOnWidth && (mqsingle || mqdouble) ? {...origprops.options, duration: mqsingle ? {days: 1} : {days: 2}} : origprops.options
  const overriddenprops = overrideDaysOnWidth && (mqsingle || mqdouble) ? {...origprops, options:overriddenoptions,}: origprops
  return (<>
    {/*<div>{"mq"+mq}</div>*/}
    <CalendarComponent plugins={[TimeGrid,CalList]} {...overriddenprops}/>
  </>)
}
// let ec = new Calendar({
//     target: document.getElementById('ec'),
//     props: {
//         plugins: [TimeGrid],
//         options: {
//             view: 'timeGridWeek',
//             events: [
//                 // your list of events
//             ]
//         }
//     }
// });