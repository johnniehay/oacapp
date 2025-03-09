import Image from "next/image";
import oacLogo from "@/public/oac-logo.jpg";
import Userbox from "@/components/userbox";
import ClientShell from "@/components/client-shell";
import ServiceWorkerManager from "@/components/service-worker-manager";
import {NavLinks} from "@/components/nav-links";

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClientShell
            headerchildren={<><Image
                className="dark:invert"
                src={oacLogo}
                alt="OAC Logo"
                // sizes="100vh"
                // Make the image display full width
                // objectFit="contain"
                style={{width: "auto", maxHeight: "100%"}}/>
                <ServiceWorkerManager />
                <Userbox className="ml-auto"/></>}
            navbarchildren={<NavLinks/>}
        >
            {children}
        </ClientShell>
    )
}