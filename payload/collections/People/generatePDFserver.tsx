import { AfterListServerProps } from "payload";
import { hasPermissionReq } from "@/lib/permissions-payload";
import { GeneratePDFButton } from "@/payload/collections/People/generatePDF";

export function GeneratePDFButtonServer( props: AfterListServerProps ){
  const hasperm = hasPermissionReq("view:people",props.user ?? null)
  if (!hasperm) return (<></>)
  return <GeneratePDFButton />
}