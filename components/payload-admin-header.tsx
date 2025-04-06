import Userbox from "@/components/userbox";
import ServiceWorkerManager from "@/components/service-worker-manager";
import Image from "next/image";
import oacLogo from "@/public/oac-logo.jpg";
import { IconArrowLeft, IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";

export default async function OACAdminHeader() {
  return (
    <header>
      <div style={{height:"40px", display:"flex", flexDirection:"row", alignItems:"center"}}>
        {/*<h1>My Custom Header</h1>*/}
        <Link href="/" style={{ height:"100%", minWidth:"4rem", display:"flex", alignItems:"center",justifyContent:"center" }}>
            <IconChevronLeft size={30}/>
        </Link>
        <Link href="/" style={{alignSelf:"normal"}}>
        <Image
          className="dark:invert"
          src={oacLogo}
          alt="OAC Logo"
          style={{ width: "auto", maxHeight: "100%" }}/></Link>
        <Link href="/" ><IconArrowLeft size={30} href="/" style={{marginInline:"2rem"}}/></Link>
        <Link href="/" ><h2>Back to Main App</h2></Link>
        {/*<Userbox className="ml-auto"/>*/}
      </div>
      <ServiceWorkerManager/>
    </header>
  )
}