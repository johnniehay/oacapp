"use client"

import { Group, Select } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";


export function JudgingRoomSelect({judgingrooms, rubrics}:{judgingrooms: {abbreviation:string}[], rubrics:string[]}) {
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
      <Select name="location" label="Room" value={searchParams?.get("room")} onChange={(v) => v && updateQueryString("room", v)} data={judgingrooms.map(loc => {return {label: loc.abbreviation, value: loc.abbreviation}})}/>
      <Select name="rubric" label="Rubric" value={searchParams?.get("rubric")} onChange={(v) => v && updateQueryString("rubric", v)} data={rubrics}/>
    </Group>
  )
}