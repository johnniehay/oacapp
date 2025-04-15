import { Table, TableData } from "@mantine/core";
import { getPayload } from "payload";
import config from '@payload-config'
import Flag from "@/components/flag";
import Link from "next/link";
import { hasPermission } from "@/lib/permissions";
import { PeopleRole, Person } from "@/payload-types";
import { peopleRoles } from "@/payload/collections/People";

const tableDataTemplate: TableData = {
  head: ['Team#', 'Team Name', 'Country', '#Coaches','#Members','#Mentors','#Supporters','#candidates','Link'],
};
export default async function AdminTeams(){
  const hasperm = await hasPermission("view:team:details:basic") //TODO: maybe restrict permission
  if (!hasperm) return <h1>Unauthorized</h1>
  const payload = await getPayload({config})
  const payloadteams = (await payload.find({collection:"team",pagination:false,depth:1,sort:"number"})).docs
  function countPeopleByRole(people: Person[], rolematches: string[]){
    const rolemap = new Map(peopleRoles.map(role => [role,rolematches.findIndex(v => role.startsWith(v))?? (rolematches.length+1) ]))
    return people.reduce((counts,person) => {
      counts[rolemap.get(person.role) ?? (rolematches.length+1)]++
      return counts
    }, Array<number>(rolematches.length).fill(0))
  }
  const teamdata = payloadteams.map(team => [team.number,
    <Link key={team.number} href={`/admin/collections/team/${team.id}`}>{team.name}</Link>,
    (<div key={team.number}><Flag country={team.country} /> {team.country}</div>),
    ...countPeopleByRole(team.people?.docs as Person[] ?? [],['coach','team_member','mentor','supporter','candidate']).map(v => v === 0 ? "" : v),
    <Link key={team.number} href={'/admin/collections/people?limit=10&page=1&'+encodeURIComponent('where[or][0][and][0][team][in]')+`=${team.id}`}>Show</Link> ])
  const tableData: TableData = {...tableDataTemplate, body:teamdata}
  return (<Table data={tableData}/>)
}