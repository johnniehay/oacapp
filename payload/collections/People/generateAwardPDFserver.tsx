import { AfterListServerProps } from "payload";
import { hasPermissionReq } from "@/lib/permissions-payload";
import { GeneratePDFButton } from "@/payload/collections/People/generatePDF";
import { GenerateCertificatePDFButton } from "@/payload/collections/People/generateCertificatePDF";
import { getRoleFromUser } from "@/lib/get-role";
import { personteamsquery } from "@/payload/collections/People/index";

export async function GenerateAwardPDFButtonServer( props: AfterListServerProps ){
  const hasperm = hasPermissionReq("view:people",props.user ?? null)
  const isCoach = getRoleFromUser(props.user) === "coach"
  const teamhasawards = isCoach && (await personteamsquery(props.user ,props.payload, 1)).map(t => (t && typeof t !== 'string' ? t.awards : null)).some(awards => !!awards)
  if (!(hasperm || teamhasawards) ) return (<></>)
  return <GenerateCertificatePDFButton pdfurl={"/teams/awardcertificate/pdf"} btntext={"Award Certificate PDF"} />
}