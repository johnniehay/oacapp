import { NavLink, NavLinkProps } from "@mantine/core";
import Link, { LinkProps } from "next/link";
import { getPayload} from "payload";
import configPromise from '@payload-config'
import { getLocalPayloadSession } from "@/lib/payload-authjs-custom/payload/session/getLocalPayloadSession";
import { hasPermission } from "@/lib/permissions";
import NavCard from "@/components/nav-card";
import {
  IconArrowUpRight,
  IconCalendarEvent, IconContract,
  IconHome,
  IconInfoCircle, IconLayoutDashboard, IconList,
  IconSettings, IconShoppingBag, IconUserPlus, IconUsersGroup
} from "@tabler/icons-react"


export async function VolunteerNavLinks({ isNavbar=true, className }: { isNavbar?:boolean, className?: string }) {
  const payload = await getPayload({ config: configPromise })
  const session = await getLocalPayloadSession()
  const checkTeamPeopleAdmin = await hasPermission("view:people")
  const checkVolunteer = await hasPermission("view:volunteer")
  const checkReferee = await hasPermission("view:scoring")
  const checkJudging = await hasPermission("view:judging")
  const commonnavlinkprops = {className:"", rightSection:<IconArrowUpRight size={"1rem"}/>}

  const navData = [
    {href:"/", label:"Home", icon: IconHome},
    // checkVolunteer && {href:"/volunteer", label: "Volunteer Dashboard", icon:IconLayoutDashboard},
    {href:"/schedule/volunteer", label:"Volunteer Schedule", icon:IconCalendarEvent},
    checkJudging && {href:"/volunteer/judge", label:"Judge Dashboard", icon:IconLayoutDashboard},
    checkReferee && {href:"/volunteer/referee", label:"Referee Dashboard", icon:IconLayoutDashboard},
    {href:"/teams", label:"Teams List", icon:IconList},
  ]

  return navData.filter(navItem => navItem && (isNavbar || navItem.label !== "Volunteer Dashboard")).map((navItem) => (!navItem ? "" :
      <NavCard key={navItem.href} isNavbar={isNavbar} icon={<navItem.icon size={"4rem"}/>}
        navlinkprops={{ href: navItem.href, label: navItem.label, ...commonnavlinkprops }}>
      {/*{navItem.children && navItem.children.map(page =>*/}
      {/*  (!page ? <></> : <NavLinkLink key={page.href} href={page.href} label={page.label} {...commonnavlinkprops}/>))}*/}
      </NavCard>
    ))
}

// interface NavNavLinkProps extends NavLinkProps {
//   nav_variant: "navlink"
//   component: JSX.ElementType
//   href: AnchorHTMLAttributes<HTMLAnchorElement>["href"]
//
// }
// interface NavButtonProps extends ButtonProps {
//   nav_variant: "button"
//   component: JSX.ElementType
//   href: AnchorHTMLAttributes<HTMLAnchorElement>["href"]
//   label?: ReactNode
// }
//
// export async function NavElement({ nav_variant, ...elProps }: NavNavLinkProps | NavButtonProps) {
//   if (nav_variant === "button") {
//     return <Button variant="outline" {...elProps as ButtonProps}>{elProps.label}</Button>
//   } else {
//     return <NavLink {...elProps as NavLinkProps} />
//   }
// }

async function NavLinkLink(props: NavLinkProps & LinkProps) {
  return (<NavLink component={Link} {...props}/>)
}