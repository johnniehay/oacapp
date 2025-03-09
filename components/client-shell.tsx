'use client'

// import {useState, useEffect} from 'react'
import {useDisclosure} from "@mantine/hooks";
import {
    AppShell,
    AppShellHeader,
    AppShellMain,
    AppShellNavbar,
    AppShellSection,
    Burger, Center,
    Group,
    ScrollArea, ScrollAreaAutosize, Space, Text
} from "@mantine/core";
import {createContext, Dispatch, SetStateAction, useState} from "react";
// import Image from "next/image";
// import oacLogo from "@/public/oac-logo.jpg";
// import Userbox from "@/components/userbox";
export const subscribeContext = createContext<{
    subscription:PushSubscription | null,
    setSubscription: Dispatch<SetStateAction<PushSubscription | null>>}>({
    subscription:null,
    setSubscription: ()=>{}
})

export default function ClientShell({
                                        children,
                                        headerchildren,
                                        navbarchildren
                                    }: Readonly<{
    children: React.ReactNode
    headerchildren: React.ReactNode
    navbarchildren: React.ReactNode
}>) {
    const [openedNavbar, {toggle: toggleNavbar}] = useDisclosure()
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)
    return (
        <subscribeContext.Provider value={{subscription,setSubscription}}>
            <AppShell header={{height: 60}}
                      padding="md"
                      // offsetScrollbars={true}
                      // layout={"alt"}
                      navbar={{
                          width: {base: 200, md: 300, lg: 400},
                          breakpoint: 'sm',
                          collapsed: {mobile: !openedNavbar, desktop: !openedNavbar},
                      }}>
                <AppShellHeader>
                    {/*<Group className="h-full px-md" justify="space-between">*/}
                    <Group className="h-full px-md">
                        <Burger
                            opened={openedNavbar} onClick={toggleNavbar}
                            // hiddenFrom="sm"
                            size="sm"/>
                        {headerchildren}
                    </Group>
                </AppShellHeader>
                <AppShellNavbar p="md">
                    {navbarchildren}
                </AppShellNavbar>
                {/*<AppShellMain display="grid" h="calc(100vh - var(--app-shell-header-height))" style={{overflow:"hidden", "grid-template-rows": "min-content 1fr" }}>*/}
                <AppShellMain className="appshellmain" h="calc(100vh - var(--app-shell-header-offset, 0rem) - var(--app-shell-padding))" style={{overflow:"hidden"}} display="flex">
                    {/*<Space h="var(--app-shell-header-height)"*/}
                    {/*       style={{*/}
                    {/*           "grid-column": "1 / -1",*/}
                    {/*           "grid-row": "1 / span 2"*/}
                    {/*}}*/}
                    {/*></Space>*/}
                    {/*<Center h="var(--app-shell-header-height)"*/}
                    {/*        pos="sticky"*/}
                    {/*        top={0}*/}
                    {/*        style={{*/}
                    {/*                "grid-column-start": "1",*/}
                    {/*                "grid-row-start": "1"*/}
                    {/*            }}>*/}
                    {/*    <Text>Dummyheader</Text>*/}
                    {/*</Center>*/}
                    {/*<AppShellSection grow>*/}
                    <ScrollAreaAutosize type="auto" scrollbars="y" flex="1" offsetScrollbars={"y"}>
                    {/*                 style={{*/}
                    {/*                     "grid-column-start": "1",*/}
                    {/*                     "grid-row-start": "2"*/}
                    {/*                 }}>*/}
                        {children}
                    </ScrollAreaAutosize>
                    {/*</AppShellSection>*/}
                </AppShellMain>
            </AppShell>
        </subscribeContext.Provider>
    )
}