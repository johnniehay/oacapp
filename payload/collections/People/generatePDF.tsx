'use client'

import { Button } from "@/payload/components/ui/button";
import { useListQuery, useSelection } from "@payloadcms/ui";
import * as qs from 'qs-esm'
import { useEffect, useState } from "react";
import { Input } from "@/payload/components/ui/input";


export function GeneratePDFButton(){
  const listquery = useListQuery()
  const { getQueryParams } = useSelection()
  const [iframeopen, setIframeopen] = useState(false)
  const [iframesrc, setIframesrc] = useState("")
  const [startPos, setStartPos] = useState(0)
  async function buttonclick() {
    setIframeopen(!iframeopen)
  }
  useEffect(() => {
    const queryParams = getQueryParams()
    const iframeSearchParams = queryParams.length !== 0 ? queryParams : qs.stringify(
      { where: listquery.query.where },
      { addQueryPrefix: true })
    console.log("iframeSearchParams", iframeSearchParams)
    setIframesrc(`/teamadmin/lanyards/pdf${iframeSearchParams}&startPos=${startPos}`)
  },[iframeopen,listquery,getQueryParams,startPos])

  return (
    <>
      <div className="gutter--left gutter--right" style={{display:"flex"}}>
        <Button style={{marginLeft:"10px"}} onClick={buttonclick}>{!iframeopen?"Show":"Hide"} Lanyards PDF</Button>
        Start position
        <Input type={"number"} min={0} max={3} value={startPos} onChange={(e) => setStartPos(e.target.valueAsNumber)}/>
      {/* TODO: add mark as printed button to set printedAt*/}
      </div>
      <div className="gutter--left gutter--right" >
        {iframeopen && (<embed style={{height: "90vh", width: "100%"}} src={iframesrc}/>)}
      </div>
    </>
  )
}