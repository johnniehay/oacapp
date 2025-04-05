"use client"

import {
  AccordionChevron,
  Box,
  Collapse,
  Group,
  NavLink,
  type NavLinkProps,
  Paper,
  Stack
} from "@mantine/core";
import type { ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import Link, { type LinkProps } from "next/link";

export default function NavCard({ children,
                                  isNavbar = false,
                                  title,
                                  navlinkprops,
                                  icon}:
                                { children?: ReactNode,
                                  isNavbar:boolean,
                                  title?: ReactNode,
                                  navlinkprops?: NavLinkProps & LinkProps,
                                  icon?: ReactNode }) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Paper className={isNavbar?"border-x-0":"dark:bg-(--mantine-color-dark-8)"} withBorder={true} shadow={"lg"} p={isNavbar?0:"sm"} radius={isNavbar?0:20}>

      <Group wrap={"nowrap"} gap={0} justify={isNavbar?"flex-start":"center"} className={"h-full"}>
        {children ?
          <div className="h-full flex flex-col items-center" onClick={toggle}>
            <Box component="span" mod={{ rotate: opened }}  className={"data-rotate:rotate-0 -rotate-90 my-auto"}>
              <AccordionChevron size="2rem"/>
            </Box>
          </div>
          :
          <div className="h-full flex flex-col items-center w-8"/>
        }
        <Stack gap={0} align={"center"}>
          {!navlinkprops && title}
          {navlinkprops && <NavLink component={Link} fw={"bold"} {...navlinkprops} label={
            <Stack gap={0} align={"center"}>
              {!isNavbar && icon && <Collapse in={!opened}>
                {icon}
              </Collapse>}
              {navlinkprops.label}
            </Stack>
          }/>}
          <Collapse in={opened}>
            {children}
          </Collapse>
        </Stack>
      </Group>
    </Paper>)
}
