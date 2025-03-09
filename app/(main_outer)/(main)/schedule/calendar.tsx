"use client"

import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import CalList from '@event-calendar/list';

import '@event-calendar/core/index.css';
import '@/app/(main_outer)/(main)/schedule/calendar.css';
// import {SvelteComponent} from "svelte";
import {useLayoutEffect, useRef} from "react";

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


export function CalendarComponent (props: Calendar.ComponentProps){
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
      return () => {calRef.current?.destroy()}
    }, []);
    // const SvelteCalendar = SvelteWrapper<Calendar>(Calendar);

    return (<div ref={svelteRef}></div>)
}

type CalendarOptionsProps = Omit<Calendar.ComponentProps,"plugins">

export function CalendarTimeGrid (props: CalendarOptionsProps){
    return (<CalendarComponent plugins={[TimeGrid]} {...props}/>)
}
export function CalendarList (props: CalendarOptionsProps){
    return (<CalendarComponent plugins={[CalList]} {...props}/>)
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