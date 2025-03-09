import { NavLink } from "@mantine/core";
import Link from "next/link";
import { getPayload } from "payload";
import configPromise from '@payload-config'

export async function NavLinks({ className }: { className?: string }) {
  const payload = await getPayload({ config: configPromise })

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

  return <>
    <NavLink component={Link} href="/" label="Home" className={className}/>
    <NavLink component={Link} href="/event-info" label="Event-Info" className={className}>
      {eventInfoPages.docs && eventInfoPages.docs.map(page =>
        (<NavLink key={page.slug} component={Link} href={`/event-info/${page.slug}`} label={page.title}
                  className={className}/>))}
    </NavLink>

    <NavLink component={Link} href="/schedule" label="Schedule" className={className}/>
    <NavLink component={Link} href="/settings" label="Settings" className={className}/>
  </>
}