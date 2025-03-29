import { Table, TableData } from "@mantine/core";
import { getPayload } from "payload";
import config from '@payload-config'
import Flag from "@/components/flag";
import Link from "next/link";

const tableDataTemplate: TableData = {
  head: ['Team#', 'Team Name', 'Country', "Schedule"],
};
export default async function Teams(){
  const payload = await getPayload({config})
  const payloadteams = (await payload.find({collection:"team",pagination:false})).docs
  const teamdata = payloadteams.map(team => [team.number,team.name,(<div key={team.number}><Flag country={team.country} /> {team.country}</div>), <Link key={team.number} href={`/schedule/team/${team.number}`}>Schedule</Link> ])
  const tableData: TableData = {...tableDataTemplate, body:teamdata}
  return (<Table data={tableData}/>)
}