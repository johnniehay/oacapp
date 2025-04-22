import { getPayload, RequiredDataFromCollection } from 'payload'
import config from '@payload-config'
import { Event, Team, Location } from "@/payload-types"
import { parse } from 'csv-parse'
import { add, parse as dateparse } from "date-fns";
import { difference } from "next/dist/build/utils";


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
  const judgloc = [1,2,3,4,5,6,7,8].reduce((accum: { [key: string]: LocationData }, abbr) => {
    return {...accum, [`Room ${abbr}`]: {name:`Room ${abbr}`, abbreviation:`Room ${abbr}`, location_type: "judging"} as LocationData}
  },{})
  const minlocations:{[key: string]: LocationData } = {...rgloc, ...judgloc }
  const missinglocations = difference(Object.keys(minlocations), Object.keys(locationcache))
  for (const loc of missinglocations) {
    locationcache[loc] = await payload.create({ collection: "location", data: minlocations[loc] });
  }


  const parser = process.stdin.pipe(parse({
    columns:(header) => header.map((col:string) => col.replace(' ','').replace('#','')),
    on_record: async (record,context) => {
      console.log(record)
      console.log(context)
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
      const retrecpart: { team: RequiredDataFromCollection<Team>, event: RequiredDataFromCollection<Event> } = {
        team: {
          number: (record.Team as string).split(' ')[1],
          name: record.TeamName,

        },
        event: {
          eventType: record.Round !== '' ? 'robotgame' : 'judging',
          start: eventstartdate.toISOString(),
          end: add(eventstartdate,{minutes:record.Round !== '' ? 10 : 30}).toISOString(),
          title: eventTitleMap[record.Round],
          location: locationcache[(record.Venue).includes("Room") ? record.Venue : eventLocationMap[record.Venue]].id
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
            console.log("would update team", retrecpart.team.number, teamcache[retrecpart.team.number], "with", newteampart)
            teamcache[retrecpart.team.number] = newteampart
            teamsaddedupdated[retrecpart.team.number] = true
          } else {
            const teamupdateres = (await payload.update({
              collection: "team",

              where: { number: { equals: retrecpart.team.number } },
              data: retrecpart.team
            }))
            console.log("Updated team", teamupdateres)
            if (teamupdateres.errors)
              teamupdateres.errors.map(console.error)
            teamcache[retrecpart.team.number] = teamupdateres.docs[0]
            teamsaddedupdated[retrecpart.team.number] = true
          }
        }
      } else {
        if (dryrun) {
          console.log("Would add new team", retrecpart.team.number,  retrecpart.team)
          teamcache[retrecpart.team.number] =  {id:"willnotbeused",createdAt:"",updatedAt:"", ...retrecpart.team}
          teamsaddedupdated[retrecpart.team.number] = true
        } else {
          try {
            const newteam = (await payload.create({ collection: "team", data: retrecpart.team }))
            console.log("Added team",newteam)
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
      if (!(retrecpart.team.number in teamcache))
        console.warn("Skipping event unable to find team", retrecpart.team.number, teamcache,retrecpart.event)
      retrecpart.event.teams = [teamcache[retrecpart.team.number].id]
      if (eventcachebyteam[retrecpart.team.number]?.find((event) => (event.title == retrecpart.event.title))) {
        console.warn("Skipping existing event, not updating")
      } else {
        if (dryrun || teamcache[retrecpart.team.number].id == "willnotbeused") {
          if (teamcache[retrecpart.team.number].id == "willnotbeused")
            console.log("Skipping dummy event", retrecpart.event)
          console.log("Would add new event", retrecpart.event)
        } else {
          const newevent = (await payload.create({collection:"event",data:retrecpart.event}))
          console.log("Added event", newevent)
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
    console.log(record)
  }
}

// Call the function here to run your seed script
await seed()