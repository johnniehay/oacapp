import * as qs from "qs-esm";

export async function getJudgingFormValues(form: string) {
  const formdata: Promise<{
    [f: string]: { entryid: string, values: string[] | null }
  }> = (await fetch("https://hay.cids.org.za/formproxy?" + qs.stringify({ form }), { next: { revalidate: 300 } })).json()
  return formdata
}