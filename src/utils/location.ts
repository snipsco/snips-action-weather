import { mappingsFactory, configFactory, MappingsData, Mappings } from '../factories'
import { slotType, NluSlot } from 'hermes-javascript'

function getMostPopulated (location: string, mappings: Mappings, countryCodeToFilterOn?: string): MappingsData {
    if (!location)
        return null

    const value: MappingsData | MappingsData[] = mappings[location]

    if (!value)
        return null

    if(value instanceof Array) {
        return value.reduce((accu, item) => {
            return (
                (
                    !countryCodeToFilterOn ||
                    item.country === countryCodeToFilterOn
                ) &&
                (
                    accu === null ||
                    accu.population < item.population
                )
            ) ? item : accu
        }, null)
    }

    return value
}

function getCountryByCode (countryCode: string) {
    const mappings = mappingsFactory.get().country
    return Object.values(mappings).find(country => country.country === countryCode)
}

export const location = {
    extractGeoNameIdAndPlace(
        countrySlot: NluSlot<slotType.custom>,
        regionSlot: NluSlot<slotType.custom>,
        citySlot: NluSlot<slotType.custom>
    ): MappingsData & { countryName?: string } {
        const mappings = mappingsFactory.get()
        const config = configFactory.get()

        const locationName =
            (citySlot && citySlot.value.value) ||
            (regionSlot && regionSlot.value.value) ||
            (countrySlot && countrySlot.value.value)

        // If no location was specified, fallback to the default location
        if (!locationName) {
            const defaultLocation = config.currentLocation
            // Try to match cities, then regions
            const location = (
                getMostPopulated(
                    defaultLocation,
                    mappings.city
                ) ||
                getMostPopulated(
                    defaultLocation,
                    mappings.region
                )
            )
            if (!location)
                throw new Error('defaultLocation')

            return location
        }

        const country = getMostPopulated(countrySlot && countrySlot.value.value, mappings.country)

        if (countrySlot && !regionSlot && !citySlot) {
            if (!country)
                throw new Error('country')
            return country
        }

        // Use the region country code if needed
        let countryCode: string, countryName: string
        if (country) {
            countryCode = country.country
            countryName = country.value
        } else {
            const region = getMostPopulated(regionSlot && regionSlot.value.value, mappings.region)
            countryCode = region && region.country || null
            countryName = countryCode && getCountryByCode(countryCode).value || null
        }

        const location = getMostPopulated(
            locationName,
            // City or Region
            citySlot ? mappings.city : mappings.region,
            // Filter on the country code if present
            countryCode
        )
        if (!location)
            throw new Error('place')
        
        return { ...location, countryName }
    }
}
