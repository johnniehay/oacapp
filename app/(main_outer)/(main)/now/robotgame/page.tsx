import { hasPermission } from "@/lib/permissions";
import { Button, Group, Stack, Title, Text } from "@mantine/core";
import { getPayload } from "payload";
import configPromise from '@payload-config'
import { Event, Team, Location } from "@/payload-types";
import Flag from "@/components/flag";
import { chunk } from "lodash";

export default async function RobotgameDisplayPage() {
    const hasperm = await hasPermission("view:queuing:status") //TODO: add specific permission
    if (!hasperm) return <Title>Unauthorized</Title>
    const payload = await getPayload({config: configPromise})
    const eventconfig = await payload.findGlobal({slug:"eventconfig",})
    if (!eventconfig.eventtime) return <Title>Event Time unset</Title>
    const currEventTime = new Date(eventconfig.eventtime)
    const robotgametables = (await payload.find({collection:"location",pagination:false,sort:"abbreviation",where:{location_type:{equals:"robotgame"}}})).docs

    const currentEvents = await payload.find({collection:"event", depth:1, where:{and:[{"end":{"greater_than_equal":currEventTime}}, {"start":{"less_than_equal":currEventTime}}]}})
    const gameslistunsorted = currentEvents.docs.filter(ev => ev.eventType === 'robotgame')
    const gamesbytableunsorted = gameslistunsorted.reduce((gbt: Record<string, Event>,ev) => {
        if (!ev.location || typeof ev.location === "string") return gbt
        gbt[ev.location.name] = ev
        return gbt
    },{})
    const gamesbytablegroup = chunk(robotgametables.map(t => gamesbytableunsorted[t.name]),2)
    function teamFromEvent(ev: Event): Team | null {
        if (!ev.teams || ev.teams.length !== 1 || typeof ev.teams[0] === 'string') return null
        return ev.teams[0]
    }
    function locationFromEvent(ev: Event): Location | null {
        return !ev.location || typeof ev.location === 'string' ? null : ev.location;
    }
    return <>
        <Title order={2}>Running Match {currEventTime.toLocaleString()}</Title>
        <Title order={2}>{gameslistunsorted.length > 0 && gameslistunsorted[0].title}</Title>
        <Group w={'100%'} grow>{gamesbytablegroup.map(([tbltop,tblbot], idx) => <Stack key={idx} justify="center" gap={"0.3rem"}>
                <Stack h={'20vh'} gap={0} justify="flex-end" bd={"1 solid"} className={"rounded-md"}>
                    <Text size="lg" ta="center">{teamFromEvent(tbltop)?.name}</Text>
                    <Text size="lg" ta="center"><Flag country={teamFromEvent(tbltop)?.country}/> #{teamFromEvent(tbltop)?.number}</Text>
                    <Button variant="outline" h={"1.5rem"} mih={"1.5rem"} m={"0.3rem"}>{locationFromEvent(tbltop)?.name}</Button>
                </Stack>
                <Stack h={'20vh'} gap={0} bd={"1 solid"} className={"rounded-md"}>
                    <Button variant="outline" h={"1.5rem"} mih={"1.5rem"} m={"0.3rem"}>{locationFromEvent(tblbot)?.name}</Button>
                    <Text size="lg" ta="center"><Flag country={teamFromEvent(tblbot)?.country}/> #{teamFromEvent(tblbot)?.number}</Text>
                    <Text size="lg" ta="center">{teamFromEvent(tblbot)?.name}</Text>
                </Stack>
            </Stack>)}</Group>
        {/* {currentEvents.docs.filter(ev => ev.eventType === 'robotgame').map(ev => <Title order={4}>{ev.title} {ev.location} {ev.eventType} {ev.teams?.map(t => (t && typeof t !== 'string' && t.name))}</Title>)} */}
    </>

}