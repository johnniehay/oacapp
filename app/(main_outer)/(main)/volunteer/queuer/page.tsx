import { hasPermission } from "@/lib/permissions";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { getPayload, Payload } from "payload";
import configPromise from "@payload-config";
import { Event, Location, Team } from "@/payload-types";
import { chunk } from "lodash";
import Flag from "@/components/flag";
import { add, sub } from "date-fns"
import { checkin } from "@/lib/checkin";
import { IconCircleCheckFilled, IconCircleX } from "@tabler/icons-react";

async function TeamCheckinsEventsByLocation(props: {payload: Payload, loc: Location, currEventTime: Date, now: Date}){
  const {payload, loc, currEventTime, now} = props
  const curevents = (await payload.find({collection:"event", depth:1, where:{and:[{location:{equals:loc.id}},{"end":{"greater_than_equal":currEventTime}}, {"start":{"less_than_equal":currEventTime}}]}})).docs
  const curteams = curevents.flatMap(ev => (ev.teams && typeof ev.teams !== "string") ? ev.teams : null).filter(teams => !!teams && typeof teams !== "string" )
  // if (curevents.length > 1) console.log("multiple current events")
  const checkins = (await payload.find({collection:"checkin", depth:1, sort:"updatedAt", where:{and:[{location:{equals:loc.id}},{who:{equals:"team"}},{team:{in:curevents.flatMap(ev => ev.teams).join(',')}},{"updatedAt":{"greater_than_equal":sub(now,{minutes:30})}}]}})).docs
  const checkinsbyteam = curteams.map(team => { return { team, checkins: checkins.filter(ci => ci.team === team.id)}})
  return {events:curevents, teams: curteams ,checkins, checkinsbyteam}
}

export default async function QueuerPage() {
  const hasperm = await hasPermission("view:queuing:status") //TODO: add specific permission
  if (!hasperm) return <Title>Unauthorized</Title>
  const payload = await getPayload({config: configPromise})
  const eventconfig = await payload.findGlobal({slug:"eventconfig",})
  if (!eventconfig.eventtime) return <Title>Event Time unset</Title>
  const currEventTime = new Date(eventconfig.eventtime)
  const now = new Date()
  const loctypes = ["robotgame", "robotgame-queue", "judging", "judging-queue"] as const
  type locType = typeof loctypes[number]
  const locs = await Promise.all(loctypes.map(async (lt) => { return {lt,locations:(await payload.find({collection:"location",pagination:false,sort:"abbreviation",where:{location_type:{equals:lt}}})).docs}}))
  // const currentevents = await Promise.all(locs.map(async ({lt,locations}) => {
  //   return {lt, locations:await Promise.all(locations.map(async loc => {
  //     return {location: loc, events:(await payload.find({collection:"event", depth:1, where:{and:[{"eventType":{in:lt}},{location:{equals:loc.id}},{"end":{"greater_than_equal":currEventTime}}, {"start":{"less_than_equal":currEventTime}}]}})).docs}
  //   }).map(async prom => {
  //     const {location, events} = await prom
  //     return {location, events: await Promise.all(events.map(async ev => {return {event:ev, teams: (ev.teams ? await Promise.all(ev.teams.map(async t => typeof t !== "string" ? { team:t, checkin: (await payload.find({collection:"checkin", where:{team:{equals:t.id}}})).docs } : null )) : null)}}))}
  //   }))}}))
  const currentevents = await Promise.all(locs.map(async ({lt,locations}) => {
    return {lt, locations:await Promise.all(locations.map(async loc => {
        return {location: loc, events:(await TeamCheckinsEventsByLocation({currEventTime,loc,now,payload}))}}))}}))
  console.dir(currentevents,{depth:5})


  // const currentRobotgames = (await payload.find({collection:"event", depth:1, where:{and:[{"eventType":{in:"robotgame"}},{"end":{"greater_than_equal":currEventTime}}, {"start":{"less_than_equal":currEventTime}}]}})).docs
  // const currentJudging = (await payload.find({collection:"event", depth:1, where:{and:[{"eventType":{in:"judging"}},{"end":{"greater_than_equal":currEventTime}}, {"start":{"less_than_equal":currEventTime}}]}})).docs
  // const currentRobotgamesQueue = (await payload.find({collection:"event", depth:1, where:{and:[{"eventType":{in:"robotgame-queue"}},{"end":{"greater_than_equal":currEventTime}}, {"start":{"less_than_equal":currEventTime}}]}})).docs

  // const gamesbytableunsorted = currentRobotgames.reduce((gbt: Record<string, Event>,ev) => {
  //   if (!ev.location || typeof ev.location === "string") return gbt
  //   gbt[ev.location.name] = ev
  //   return gbt
  // },{})
  // // const gamesbytablegroup = chunk(robotgametables.map(t => gamesbytableunsorted[t.name]),2)
  // function teamFromEvent(ev: Event): Team | null {
  //   if (!ev.teams || ev.teams.length !== 1 || typeof ev.teams[0] === 'string') return null
  //   return ev.teams[0]
  // }
  // function locationFromEvent(ev: Event): Location | null {
  //   return !ev.location || typeof ev.location === 'string' ? null : ev.location;
  // }
  async function onClickCheckInButton(locationid:string,teamid:string){
    "use server"
    const checkinres = await checkin({who:"team",locationid,teamid})
    console.log(checkinres)
  }
  return <>
    <Title order={2}>Running Match {currEventTime.toLocaleString()}</Title>
    {/*<Title order={2}>{gameslistunsorted.length > 0 && gameslistunsorted[0].title}</Title>*/}
    <Group w={'100%'} grow>
      {currentevents.map(({lt,locations}) => <Stack key={lt}>
        <Title order={1}>{lt}</Title>
        {locations.map(({location,events}) => <Stack key={location.id}>
          <Title order={2}>{location.name}</Title>
          {/*{events.events.map(ev => <Title key={ev.id} order={3}>{ev.title} {JSON.stringify(ev.)}</Title>)}*/}
          {events.checkinsbyteam.map(({team,checkins}) => <Title key={team.id} order={3}>{team.name} {checkins.length > 0?<IconCircleCheckFilled/>:<IconCircleX/>} <Button onClick={onClickCheckInButton.bind(null,location.id,team.id)}>Is Here</Button></Title>)}
          {/*<Title order={2}>{events.name}</Title>*/}
        </Stack>)}
      </Stack>)}
    </Group>
    {/*<Group w={'100%'} grow>{gamesbytablegroup.map(([tbltop,tblbot], idx) => <Stack key={idx} justify="center" gap={"0.3rem"}>*/}
    {/*  <Stack h={'20vh'} gap={0} justify="flex-end" bd={"1 solid"} className={"rounded-md"}>*/}
    {/*    <Text size="lg" ta="center">{teamFromEvent(tbltop)?.name}</Text>*/}
    {/*    <Text size="lg" ta="center"><Flag country={teamFromEvent(tbltop)?.country}/> #{teamFromEvent(tbltop)?.number}</Text>*/}
    {/*    <Button variant="outline" h={"1.5rem"} mih={"1.5rem"} m={"0.3rem"}>{locationFromEvent(tbltop)?.name}</Button>*/}
    {/*  </Stack>*/}
    {/*  <Stack h={'20vh'} gap={0} bd={"1 solid"} className={"rounded-md"}>*/}
    {/*    <Button variant="outline" h={"1.5rem"} mih={"1.5rem"} m={"0.3rem"}>{locationFromEvent(tblbot)?.name}</Button>*/}
    {/*    <Text size="lg" ta="center"><Flag country={teamFromEvent(tblbot)?.country}/> #{teamFromEvent(tblbot)?.number}</Text>*/}
    {/*    <Text size="lg" ta="center">{teamFromEvent(tblbot)?.name}</Text>*/}
    {/*  </Stack>*/}
    {/*</Stack>)}</Group>*/}
    {/* {currentEvents.docs.filter(ev => ev.eventType === 'robotgame').map(ev => <Title order={4}>{ev.title} {ev.location} {ev.eventType} {ev.teams?.map(t => (t && typeof t !== 'string' && t.name))}</Title>)} */}
  </>

}