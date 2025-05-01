import { Title } from "@mantine/core";
import { VolunteerNavLinks } from "@/components/volunteer-nav-links";

export default async function VolunteerDashboard(){
  return (
    <>
      <Title>Volunteer Dashboard</Title>
      <VolunteerNavLinks isNavbar={false}/>
      <Title order={2}>This page is still under construction</Title>
      <Title order={3}>Reach out to the Volunteer Coordinator (<a href={"mailto:volunteers@firstsa.org"}>volunteers@firstsa.org</a>) or on the Whatsapp group if you need more information</Title>
    </>)
}