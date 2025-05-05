import { FunctionComponent } from "react";
import type { Event } from "@/payload-types"
import { Paper, PaperProps, Stack } from "@mantine/core";

const EventTimeTypeList = ['past','current','future'] as const;
export type EventTimeType = typeof EventTimeTypeList[number];
export type EventsTimeType = {
  past: Event[]
  current: Event | null
  future: Event[]
}
export type EventWithTimeType = {
  event:Event|null,
  eventTimeType:EventTimeType
}

export default async function EventStack({events,paperProps,EventItem}:{events:EventsTimeType,paperProps:Record<EventTimeType, PaperProps>,EventItem:FunctionComponent<EventWithTimeType>}) {
  const allevents: EventWithTimeType[] = EventTimeTypeList.flatMap(ett => {
    if (ett === "current") return [{event: events[ett], eventTimeType:ett as EventTimeType}]
    else return events[ett].map((event:Event|null) => {return {event, eventTimeType:ett as EventTimeType}})
  })
  return (
    <Stack>
      {allevents.map(({event, eventTimeType},index) => <Paper key={event?.id??index}  withBorder={true} shadow={"lg"} p="sm" radius={20} {...paperProps[eventTimeType]}>
        <EventItem event={event} eventTimeType={eventTimeType}/>
      </Paper>)}
    </Stack>
  )
}