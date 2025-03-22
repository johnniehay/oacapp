import type { Access } from 'payload'
import { hasPermissionReq } from "@/lib/permissions-payload";
import { Permission } from "@/lib/roles";

export function authenticatedOrPublished(permission: Permission) {
  const authenticatedOrPublishedClosure: Access = ({ req: { user } }) => {
    if (user && hasPermissionReq(permission, user)) {
      return true
    }

    return {
      _status: {
        equals: 'published',
      },
    }
  }
  return authenticatedOrPublishedClosure
}