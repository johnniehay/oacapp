import type { User } from "@/payload-types";
import { NonPublicPermissions, Permission, rolePermissions, Roles } from "@/lib/roles";

export function getPermissionsReq(user: User | null, accesscookie?: string){
  if (user) {
    if (!user.role || !(user.role in rolePermissions)) {
      return []
    }
    return rolePermissions[user.role]
  } else {
    if (accesscookie && accesscookie === process.env.NONPUBLIC_ACCESS) {
      return NonPublicPermissions
    }
    return []
  }
}
export function hasPermissionReq(permission: Permission,user: User | null, accesscookie?: string) {
  const permissions = getPermissionsReq(user,accesscookie)
  return permissions.includes(permission)
}