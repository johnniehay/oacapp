import { Button, ButtonProps, NavLink, NavLinkProps, Stack } from "@mantine/core";
import Link, { LinkProps } from "next/link";
import { getPayload, PayloadRequest } from "payload";
import configPromise from '@payload-config'
import { AnchorHTMLAttributes, JSX, ReactNode } from "react";
import { getLocalPayloadSession } from "@/lib/payload-authjs-custom/payload/session/getLocalPayloadSession";
import { coachteamsquery } from "@/payload/collections/People";
import { hasPermission } from "@/lib/permissions";
import NavCard from "@/components/nav-card";
import {
  IconArrowUpRight,
  IconCalendarEvent,
  IconHome,
  IconInfoCircle,
  IconSettings, IconUsersGroup
} from "@tabler/icons-react"


export async function NavLinks({ isNavbar=true, className }: { isNavbar?:boolean, className?: string }) {
  const payload = await getPayload({ config: configPromise })
  const session = await getLocalPayloadSession()
  
  const checkTeamPeopleAdmin = (await hasPermission("view:people")) || (await coachteamsquery(session?.user ,payload)).length > 0
  console.log("checkTeamPeopleAdmin", checkTeamPeopleAdmin,(await hasPermission("view:people")),(await coachteamsquery(session?.user ,payload)))
  const eventInfoPages = await payload.find({
    collection: "pages",
    depth: 1,
    limit: 20,
    pagination: false,
    select: {
      title: true,
      slug: true
    }
  })
  const commonnavlinkprops = {className:"", rightSection:<IconArrowUpRight size={"1rem"}/>}

  const navData = [
    {href:"/", label:"Home", icon: IconHome},
    {href:"/event-info", label:"Event Info", icon: IconInfoCircle,
      children:eventInfoPages.docs.map(page => {
        return {href:`/event-info/${page.slug}`, label:page.title}})},
    {href:"/schedule", label:"Schedule", icon:IconCalendarEvent},
    {href:"/settings", label:"Settings", icon:IconSettings},
    checkTeamPeopleAdmin && { href:'/admin/collections/people?columns=%5B"name"%2C"-user"%2C"team"%2C"role"%2C"-id"%2C"-updatedAt"%2C"createdAt"%5D', label:"Team Admin", icon:IconUsersGroup},
  ]

  return navData.map((navItem) => (!navItem ? "" :
      <NavCard key={navItem.href} isNavbar={isNavbar} icon={<navItem.icon size={"4rem"}/>}
        navlinkprops={{ href: navItem.href, label: navItem.label, ...commonnavlinkprops }}>
      {navItem.children && navItem.children.map(page =>
        (!page ? <></> : <NavLinkLink key={page.href} href={page.href} label={page.label} {...commonnavlinkprops}/>))}
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