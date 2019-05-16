import { NluSlot, slotType } from 'hermes-javascript/types'

export function createIntervalSlot(
    { from, to, rawValue } : { from: string, to: string, rawValue?: string }
): NluSlot<typeof slotType.timeInterval> {
    return {
        slotName: 'forecast_datetime',
        entity: 'snips/datetime',
        confidenceScore: 1,
        rawValue: rawValue || '',
        value: {
            kind: slotType.timeInterval,
            from,//: '2019-02-22 00:00:00 +01:00',
            to//: '2019-02-24 00:00:00 +01:00'
        },
        range: {
            start: 0,
            end: 1
        }
    }
}

export function createCountrySlot(value: string) {
    return {
        slotName: 'country',
        entity: 'country_us',
        confidenceScore: 1,
        rawValue: value,
        value: {
            kind: slotType.custom,
            value: value
        },
        range: {
            start: 0,
            end: 1
        }
    }
}

export function createRegionSlot(value: string) {
    return {
        slotName: 'region',
        entity: 'region_us',
        confidenceScore: 1,
        rawValue: value,
        value: {
            kind: slotType.custom,
            value: value
        },
        range: {
            start: 0,
            end: 1
        }
    }
}

export function createCitySlot(value: string) {
    return {
        slotName: 'city',
        entity: 'city_us',
        confidenceScore: 1,
        rawValue: value,
        value: {
            kind: slotType.custom,
            value
        },
        range: {
            start: 0,
            end: 1
        }
    }
}

export function createConditionSlot(value: string) {
    return {
        slotName: 'condition_name',
        entity: 'condition_name_us',
        confidenceScore: 1,
        rawValue: value,
        value: {
            kind: slotType.custom,
            value
        },
        range: {
            start: 0,
            end: 1
        }
    }
}
