import { Group, Title } from "@mantine/core";
import { VolunteerNavLinks } from "@/components/volunteer-nav-links";

export default async function VolunteerDashboard(){
  return (
    <>
      <Title>Volunteer Dashboard</Title>
      <Group mt={"md"} align={"stretch"} preventGrowOverflow={false} grow><VolunteerNavLinks isNavbar={false}/></Group>
    </>)
}