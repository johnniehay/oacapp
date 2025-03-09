import {ColorSchemesSwitcher} from "@/components/color-schemes-switcher";
import {
    BackgroundImage, Center, Group, Stack,
    Text,
    Title,
} from "@mantine/core";
import InstallPrompt from "@/components/install-prompt";
import PushNotificationManager from "@/components/push-notification-manager";
import {NavLinks} from "@/components/nav-links";

export default function Home() {
    return (
        <>
            <BackgroundImage src={"https://oac.firstsa.org/wp-content/uploads/2024/10/CT_background.jpg"} radius="md" mih="50vh" display="flex" > {/* bga="fixed" pos="sticky" className="-top-[4rem] md:-top-[11rem] xs:max-md:-top-[6rem]"> */}
                <Center p="md" m={"auto"}> {/*pos="sticky" top="2rem"*/}
                    <Stack c="white" align="center" justify="center" className="grow text-center">
                        <Title order={1}>FIRST® LEGO® League Open Africa Championship</Title>
                        <Title order={1}>7-9 May 2025</Title>
                    </Stack>
                </Center>
            </BackgroundImage>
            <Group grow ><NavLinks className="w-auto"/></Group>
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
