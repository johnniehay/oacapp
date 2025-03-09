import { auth } from "@/auth";
import { NonPublicPermissions, Permission, rolePermissions, Roles } from "@/lib/roles";
import { User } from "@prisma/client";
import { cookies } from "next/headers";

export async function getPermissions() {
  const session = await auth()
  if (session && session.user) {
    const user = session.user as User
    return rolePermissions[user.role as Roles]
  } else {
    const cookieStore = await cookies()
    const accesscookie = cookieStore.get("access")
    if (accesscookie && accesscookie.value === process.env.NONPUBLIC_ACCESS) {
      return NonPublicPermissions
    }
    return []
  }
}

export async function hasPermission(permission: Permission) {
  return (await getPermissions()).includes(permission)
}
