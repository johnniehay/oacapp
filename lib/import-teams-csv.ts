import { getPayload, RequiredDataFromCollection } from 'payload'
import config from '@payload-config'
import { Team } from "@/payload-types"
import { parse } from 'csv-parse'


const seed = async () => {
  // Get a local copy of Payload by passing your config
  const payload = await getPayload({ config })

  const teamquery = (await payload.find({collection:"team",pagination:false}))
  const teamcache = teamquery.docs.reduce((accum: { [key: string]: Team }, team) => {
    return {...accum, [team.number]: team}
  }, {})
  const teamsaddedupdated: {[x:string]: boolean} = {}

  const parser = process.stdin.pipe(parse({
    columns:(header) => header.map((col:string) => col.replace(' ','').replace('#','')),
    on_record: async (record,context) => {
      console.log(record)
      console.log(context)
      const dryrun = false

      const retrecpart: { team: RequiredDataFromCollection<Team> } = {
        team: {
          number: ("TeamNumber" in record) ? record.TeamNumber : (record.Team as string).split(' ')[1],
          name: ("TeamNAME" in record) ? record.TeamNAME : record.TeamName,
          country: ("TeamNAME" in record && record.Country !== '') ? record.Country : undefined
        },
      }
      if (retrecpart.team.number?.length !== 3) {
        console.warn("Team number not valid:", retrecpart.team.number)
        return null
      }
      if (retrecpart.team.name?.length === 0) {
        console.warn("Team name empty:", retrecpart.team.number)
        return null
      }
      if (retrecpart.team.number in teamcache) {
        const newteampart = { ...teamcache[retrecpart.team.number], ...retrecpart.team }
        if (newteampart != teamcache[retrecpart.team.number] && !(retrecpart.team.number in teamsaddedupdated)) {
          retrecpart.team = newteampart
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