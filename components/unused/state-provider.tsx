"use client"

import {useDisclosure} from "@mantine/hooks";
import {createContext, useContext} from "react";

type NavbarContextType = [boolean, {toggle: () => void}] ;

const NavbarContext = createContext<NavbarContextType | null>(null);

export const useCurrentNavbarDisclosure = () => {
  const navbarDisclosureContext = useContext(NavbarContext);

  if (!navbarDisclosureContext) {
    throw new Error(
      "useCurrentUser has to be used within <navbarDisclosureContext.Provider>"
    );
  }

  return navbarDisclosureContext;
};

export default function StateProvider({
                                                children,
                                            }: Readonly<{
    children: React.ReactNode;
}>) {
    const [openedNavbar, { toggle: toggleNavbar }] = useDisclosure()

    return (
        <NavbarContext.Provider value={[openedNavbar, {toggle: toggleNavbar}]}>
            {children}
        </NavbarContext.Provider>
    )
}