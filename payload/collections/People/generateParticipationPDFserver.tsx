import { AfterListServerProps } from "payload";
import { hasPermissionReq } from "@/lib/permissions-payload";
import { GeneratePDFButton } from "@/payload/collections/People/generatePDF";
import { GenerateCertificatePDFButton } from "@/payload/collections/People/generateCertificatePDF";
import { getRoleFromUser } from "@/lib/get-role";

export function GenerateParticipationPDFButtonServer( props: AfterListServerProps ){
  const hasperm = hasPermissionReq("view:people",props.user ?? null) || getRoleFromUser(props.user) === "coach"
  if (!hasperm) return (<></>)
  return <GenerateCertificatePDFButton pdfurl={"/teams/participation/pdf"} btntext={"Participation Certificate PDF"} />
}