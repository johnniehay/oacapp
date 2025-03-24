import {
  Box, Center, Group, Stack,
  Title,
} from "@mantine/core";
import { NavLinks } from "@/components/nav-links";
import CT_background from "@/public/CT_background.jpg"
import { getImageSet } from "@/lib/images";

export default function Home() {
  return (
    <>
      <Box style={{backgroundImage:getImageSet(CT_background), borderRadius:"var(--mantine-radius-md)"}}// radius="md"
           mih="50vh"
           display="flex"
           className={"bg-[center_top_40%] bg-cover"}> {/* bga="fixed" pos="sticky" className="-top-[4rem] md:-top-[11rem] xs:max-md:-top-[6rem]"> */}
        <Center p="md" m={"auto"}> {/*pos="sticky" top="2rem"*/}
          <Stack c="white" align="center" justify="center" className="grow text-center">
            <Title order={1}>FIRST® LEGO® League Open Africa Championship</Title>
            <Title order={1}>7-9 May 2025</Title>
          </Stack>
        </Center>
      </Box>
      <Group grow><NavLinks className="w-auto"/></Group>
    </>
    // <div className="flex justify-center mt-10">
    //     <ColorSchemesSwitcher/>
    // </div>
    // <PushNotificationManager></PushNotificationManager>
    // <InstallPrompt></InstallPrompt>
    // </ClientShell>
    //   </AppShellMain>
    // </AppShell>
  );
}
