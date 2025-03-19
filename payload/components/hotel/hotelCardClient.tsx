'use client'

import { Button, Card, CardSection, Text, Modal, ButtonProps, ModalProps } from "@mantine/core";
import NextImage from "next/image";
import { IconExternalLink } from "@tabler/icons-react";
import { HotelData } from "@/payload/components/hotel/hotel";
import { useDisclosure } from "@mantine/hooks";

export function HotelCardClient({
                                  children,
                                  cardcontent,
                                  cardbuttoncontent,
                                  cardbuttonprops,
                                  modalprops
                                }: Readonly<{
  children: React.ReactNode
  cardcontent: React.ReactNode
  cardbuttoncontent: React.ReactNode
  cardbuttonprops:ButtonProps
  modalprops:Partial<ModalProps>
}>) {
  const [opened, { open, close }] = useDisclosure(false);

  return (<><Card p="sm">
    {cardcontent}
    <Button onClick={open} {...cardbuttonprops}>
      {cardbuttoncontent}
    </Button>
  </Card>
    <Modal opened={opened} onClose={close}  {...modalprops}>
      {children}
    </Modal>
  </>)
}
