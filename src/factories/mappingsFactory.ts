import fs from 'fs'
import { ASSETS_PATH } from '../constants'

export type MappingsData = {
    geonameid: string
    country: string
    value: string
    population: number
}
export type Mappings = {
    [key: string]: MappingsData | MappingsData[]
}

let mappings: {
    city: Mappings,
    region: Mappings,
    country: {
        [key: string]: MappingsData
    }
}

function init (language: string) {
    mappings = {
        city: JSON.parse(fs.readFileSync(`${ASSETS_PATH}/mappings/${language}/city.json`, 'utf8')),
        region: JSON.parse(fs.readFileSync(`${ASSETS_PATH}/mappings/${language}/region.json`, 'utf8')),
        country: JSON.parse(fs.readFileSync(`${ASSETS_PATH}/mappings/${language}/country.json`, 'utf8')),
    }
}

function get() {
    return mappings
}

export const mappingsFactory = {
    init,
    get
}