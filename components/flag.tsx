import "flag-icons/css/flag-icons.min.css"

import countries from "flag-icons/country.json"

export const countrycodebyname = countries.reduce((ccn: {[countryname:string]: string}, country) => {
  ccn[country.name] = country.code
  return ccn
},{})

export default async function Flag( { country }: {country?: string | null }){
  let countrycode: string
  if (!country || !(country in countrycodebyname)) {
    countrycode = "xx"
  } else {
    countrycode = countrycodebyname[country]
  }
  return (<span className={`fi fi-${countrycode}`}></span> )
}