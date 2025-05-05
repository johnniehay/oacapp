import { getPayload, RequiredDataFromCollection } from 'payload'
import config from '@payload-config'
import { Event, Team, Location } from "@/payload-types"
import { parse } from 'csv-parse'
import { add, sub, parse as dateparse } from "date-fns";
import { difference } from "next/dist/build/utils";
import { flushAndExit } from "next/dist/telemetry/flush-and-exit";


const seed = async () => {
  // Get a local copy of Payload by passing your config
  const payload = await getPayload({ config })

  const teamquery = (await payload.find({collection:"team",pagination:false}))
  const teamcache = teamquery.docs.reduce((accum: { [key: string]: Team }, team) => {
    return {...accum, [team.number]: team}
  }, {})
  const teamsaddedupdated: {[x:string]: boolean} = {}
  const eventquery = (await payload.find({collection:"event",pagination:false}))
  // eventquery.docs.fi
  const eventcachebyteam = eventquery.docs.reduce((accum: { [key: string]: Event[] }, event) => {
    if (!event.teams || event.teams.length === 0)  {
      return { ...accum, [event.eventType]: [...(accum[event.eventType] ?? []), event] }
    }
    if (event.teams.length === 1) {
      if (typeof event.teams[0] === "string") {
        return accum
      } else {
        return { ...accum, [event.teams[0].number]: [...(accum[event.teams[0].number] ?? []), event] }
      }
    }
    if (event.teams.length > 1) {
      return { ...accum, all:[...(accum.all ?? []), event] }
    }
    return accum
  }, {})

  const locationquery = await payload.find({collection:"location",pagination:false})
  const locationcache = locationquery.docs.reduce((accum: { [key: string]: Location }, location) => {
    return { ...accum, [location.name]: location }
  },{})
  type LocationData = Omit<Location,"id"|"updatedAt"|"createdAt">
  const rgloc = ["A", "B", "C", "D", "E", "F", "G", "H"].reduce((accum: { [key: string]: LocationData }, abbr) => {
    return {...accum, [`Table ${abbr}`]: {name:`Table ${abbr}`, abbreviation:abbr, location_type: "robotgame"} as LocationData}
  },{})
  const rgqueueloc = ["A", "B", "C", "D", "E", "F", "G", "H"].reduce((accum: { [key: string]: LocationData }, abbr) => {
    return {...accum, [`Queue for Table ${abbr}`]: {name:`Queue for Table ${abbr}`, abbreviation:"Q"+abbr, location_type: "robotgame-queue"} as LocationData}
  },{})
  const judgloc = [1,2,3,4,5,6,7,8].reduce((accum: { [key: string]: LocationData }, abbr) => {
    return {...accum, [`Judging Room ${abbr}`]: {name:`Judging Room ${abbr}`, abbreviation:`Room ${abbr}`, location_type: "judging"} as LocationData}
  },{})
  const judgqueueloc = {'Queue for Judging Rooms':{name:'Queue for Judging Rooms', abbreviation:`QJudging`, location_type: "judging-queue"} as LocationData }
  const minlocations:{[key: string]: LocationData } = {...rgloc, ...judgloc, ...rgqueueloc, ...judgqueueloc }
  const missinglocations = difference(Object.keys(minlocations), Object.keys(locationcache))
  for (const loc of missinglocations) {
    console.dir({msg:"creating loc", minloc:minlocations[loc]},{compact:true,breakLength:Infinity})
    try {
      locationcache[loc] = await payload.create({ collection: "location", data: minlocations[loc] });
    } catch(err) {
      console.error("location create error",err)
      return
    }
  }


  const parser = process.stdin.pipe(parse({
    columns:(header) => header.map((col:string) => col.replace(' ','').replace('#','')),
    on_record: async (record,context) => {
      console.dir({msg:"record", record,context},{compact:true,breakLength:Infinity})
      if (record.Venue === "\n") return {skipping: record}
      const dryrun = false
      const eventTitleMap:{[key: string]: string} = {
        R1:"Robot Game Round 1",
        R2:"Robot Game Round 2",
        R3:"Robot Game Round 3",
        P1:"Robot Game Practice Round 1",
        P2:"Robot Game Practice Round 2",
        AR:"Robot Game Alliance Round",
        '':"Judging"
      };
      const eventLocationMap:{[key: string]: string} = {
        A:"Table A",
        B:"Table B",
        C:"Table C",
        D:"Table D",
        E:"Table E",
        F:"Table F",
        G:"Table G",
        H:"Table H",
      };
      const eventstartdate = dateparse(`${record.Date} ${record.Time}`, 'M/d/y H:mm', new Date())
      if (!locationcache[(record.Venue).includes("Room") ? "Queue for Judging Rooms" : `Queue for ${eventLocationMap[record.Venue]}` ])
        console.log("queueeventloc", (record.Venue).includes("Room") ? "Queue for Judging Rooms" : `Queue for ${eventLocationMap[record.Venue]}`)
      if (!locationcache[(record.Venue).includes("Room") ? `Judging ${record.Venue}` : eventLocationMap[record.Venue]])
        console.log("eventloc", (record.Venue).includes("Room") ? `Judging ${record.Venue}` : eventLocationMap[record.Venue])
      const retrecpart: { team: RequiredDataFromCollection<Team>, event: RequiredDataFromCollection<Event>, queue_event: RequiredDataFromCollection<Event> } = {
        team: {
          number: (record.Team as string).split(' ')[1],
          name: record.TeamName,

        },
        event: {
          eventType: record.Round !== '' ? 'robotgame' : 'judging',
          start: eventstartdate.toISOString(),
          end: add(eventstartdate,{minutes:record.Round !== '' ? 10 : 30}).toISOString(),
          title: eventTitleMap[record.Round],
          location: locationcache[(record.Venue).includes("Room") ? `Judging ${record.Venue}` : eventLocationMap[record.Venue]].id
        },
        queue_event: {
          eventType: record.Round !== '' ? 'robotgame-queue' : 'judging-queue',
          start: sub(eventstartdate,{minutes:record.Round !== '' ? 10 : 15}).toISOString(),
          end: eventstartdate.toISOString(),
          title: "Queue for " + eventTitleMap[record.Round],
          location: locationcache[(record.Venue).includes("Room") ? "Queue for Judging Rooms" : `Queue for ${eventLocationMap[record.Venue]}` ].id
        }
      }
      if (retrecpart.team.number?.length !== 3) {
        console.warn("Team number not valid:", retrecpart.team.number)
        return null
      }
      if (retrecpart.team.number in teamcache) {
        const newteampart = { ...teamcache[retrecpart.team.number], ...retrecpart.team }
        if (newteampart != teamcache[retrecpart.team.number] && !(retrecpart.team.number in teamsaddedupdated)) {
          retrecpart.team = newteampart
          const dryrun = true // disable team updates
          if (dryrun) {
            console.dir({msg:"would update team", teamnum:retrecpart.team.number, teamcached:teamcache[retrecpart.team.number], "with":newteampart},{compact:true,breakLength:Infinity})
            teamcache[retrecpart.team.number] = newteampart
            teamsaddedupdated[retrecpart.team.number] = true
          } else {
            const teamupdateres = (await payload.update({
              collection: "team",

              where: { number: { equals: retrecpart.team.number } },
              data: retrecpart.team
            }))
            console.dir({msg:"Updated team", teamupdateres},{compact:true,depth:3,breakLength:Infinity})
            if (teamupdateres.errors)
              teamupdateres.errors.map(console.error)
            teamcache[retrecpart.team.number] = teamupdateres.docs[0]
            teamsaddedupdated[retrecpart.team.number] = true
          }
        }
      } else {
        if (dryrun) {
          console.dir({msg:"Would add new team", teamnum:retrecpart.team.number,  recteam:retrecpart.team},{compact:true,breakLength:Infinity})
          teamcache[retrecpart.team.number] =  {id:"willnotbeused",createdAt:"",updatedAt:"", ...retrecpart.team}
          teamsaddedupdated[retrecpart.team.number] = true
        } else {
          try {
            const newteam = (await payload.create({ collection: "team", data: retrecpart.team }))
            console.dir({msg:"Added team", newteam},{compact:true,breakLength:Infinity})
            teamcache[retrecpart.team.number] = newteam
            retrecpart.team = newteam
            teamsaddedupdated[retrecpart.team.number] = true
          } catch(err) {
            console.error("teame create error",err)
            console.log("teamsaddedupdated",teamsaddedupdated[retrecpart.team.number])
            console.log("teamcache",teamcache[retrecpart.team.number])
          }

        }
      }
      if (!(retrecpart.team.number in teamcache)) {
        console.dir({msg: "Skipping event unable to find team", teamnumber: retrecpart.team.number, teamcache: Object.keys(teamcache), recevent: retrecpart.event}, { compact: true, breakLength: Infinity })
        return retrecpart
      }
      retrecpart.event.teams = [teamcache[retrecpart.team.number].id]
      if (eventcachebyteam[retrecpart.team.number]?.find((event) => (event.title == retrecpart.event.title))) {
        console.warn("Skipping existing event, not updating")
      } else {
        if (dryrun || teamcache[retrecpart.team.number].id == "willnotbeused") {
          if (teamcache[retrecpart.team.number].id == "willnotbeused")
            console.dir({msg:"Skipping dummy event", newevent:retrecpart.event},{compact:true,breakLength:Infinity})
          console.dir({msg:"Would add new event", newevent:retrecpart.event},{compact:true,breakLength:Infinity})
        } else {
          const newevent = (await payload.create({collection:"event",data:retrecpart.event}))
          console.dir({msg:"Added event", newevent},{compact:true,breakLength:Infinity})
        }
      }
      retrecpart.queue_event.teams = [teamcache[retrecpart.team.number].id]
      if (eventcachebyteam[retrecpart.team.number]?.find((event) => (event.title == retrecpart.queue_event.title))) {
        console.warn("Skipping existing event, not updating")
      } else {
        if (dryrun || teamcache[retrecpart.team.number].id == "willnotbeused") {
          if (teamcache[retrecpart.team.number].id == "willnotbeused")
            console.dir({msg:"Skipping dummy event", newevent:retrecpart.queue_event},{compact:true,breakLength:Infinity})
          console.dir({msg:"Would add new event", newevent:retrecpart.queue_event},{compact:true,breakLength:Infinity})
        } else {
          const newevent = (await payload.create({collection:"event",data:retrecpart.queue_event}))
          console.dir({msg:"Added event", newevent},{compact:true,breakLength:Infinity})
        }
      }

      // const retrec: {team:Team,event:Event} = retrecpart
      const retrec = retrecpart
      return retrec
    }
  }))
// Team#,Team Name,Date,Time,Round,Venue
// Team 096,Name 096,5/8/2025,14:40,R2,A
// Team 096,Name 096,5/8/2025,16:00,,Room 8
// Team 097,Name 097,5/8/2025,9:40,P2,B
  for await (const record of parser) {
    // console.dir({msg:"RetRecord",record},{compact:true,breakLength:Infinity})
  }
}

// Call the function here to run your seed script
await seed()
console.log("done")
await flushAndExit(0)
