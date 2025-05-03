"use client"

import { Group, Select } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";


export function RefereeTableSelect({robotgametables, refereesNames}:{robotgametables: {abbreviation:string}[], refereesNames:string[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const updateQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString())
      params.set(name, value)
      router.push('?' + params)
    },
    [router, searchParams]
  )
  return (
    <Group>
      <Select name="location" label="Table" value={searchParams?.get("table")} onChange={(v) => v && updateQueryString("table", v)} data={robotgametables.map(loc => {return {label: loc.abbreviation, value: loc.abbreviation}})}/>
      <Select name="referee" label="Referee" value={searchParams?.get("referee")} onChange={(v) => v && updateQueryString("referee", v)} data={refereesNames}/>
    </Group>
  )
}