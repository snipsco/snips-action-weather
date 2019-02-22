import { DEFAULT_LANGUAGE } from '../constants'

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
} = null

function init (language = DEFAULT_LANGUAGE) {
    mappings = {
        city: require(`../../assets/mappings/${language}/city.json`),
        region: require(`../../assets/mappings/${language}/region.json`),
        country: require(`../../assets/mappings/${language}/country.json`)
    }
}

function get() {
    return mappings
}

export const mappingsFactory = {
    init,
    get
}