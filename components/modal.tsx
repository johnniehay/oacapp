"use client"

import {  Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createContext } from "react";

export const ModalStateContext = createContext<{
  opened: boolean,
  open: () => void,
  close: () => void,
}>({
  opened: false,
  open: () => {},
  close: () => {}
})

export function ClientModal({children, startopened, title}:Readonly<{
  children: React.ReactNode,
  title: string,
  startopened?: boolean,
}>) {
  const [opened, { open, close }] = useDisclosure(startopened);

  return (
    <Modal opened={opened} onClose={close} title={title}>
      <ModalStateContext value={{opened, open, close}}>
        {children}
      </ModalStateContext>
    </Modal>
  )
}