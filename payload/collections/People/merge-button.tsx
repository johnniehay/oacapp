'use client'

import { Button } from "@/payload/components/ui/button";
import { useSelection } from "@payloadcms/ui";
import { mergePeople } from "@/payload/collections/People/merge-server-action";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

export default function PeopleMergeButton( ){
  const { selected, count } = useSelection()
  const {executeAsync:executeMergePeople} = useAction(mergePeople,{onSuccess:({data}) => setMergeResult(data?.error??"")})
  const [mergeResult, setMergeResult] = useState("")
  async function buttonclick() {
    const ids = []
    for (const [key, value] of selected) {
      if (value) {
        ids.push(key)
      }
    }
    console.dir({ "mergebuttoncount": count, "mergebuttonselected": ids }, { depth: 7 });
    await executeMergePeople(ids as string[])
  }
  return (
    <div className="gutter--left gutter--right" style={{display:"flex"}}>
      <span style={{marginLeft:"auto",color:"red"}}>{mergeResult}</span>
      {count==2 && <Button style={{marginLeft:"10px"}} onClick={buttonclick}>Merge</Button>}
    </div>
  )
}