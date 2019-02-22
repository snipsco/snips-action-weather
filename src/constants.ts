export const DEFAULT_LOCALE = 'english'
export const SUPPORTED_LOCALES = [ 'english', 'french' ]
export const DEFAULT_LANGUAGE = 'en'
export const LANGUAGE_MAPPINGS = {
    english: 'en',
    french: 'fr'
}
export const HOUR_MILLISECONDS = 1000 * 60 * 60
export const DAY_MILLISECONDS = 1000 * 60 * 60 * 24
// 5 days
export const FORECAST_DAYS_LIMIT = 1000 * 60 * 60 * 24 * 5
// Forecast granularity - 3 hours
export const FORECAST_PERIOD = 1000 * 60 * 60 * 3
export const DAY_LIST = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
]
export const SLOT_THRESHOLD = 0
export const ASR_THRESHOLD = 0.5
export const INTENT_THRESHOLD = 0.5
export const INTENT_FILTER_THRESHOLD = 0
export const MIN_THRESHOLDS = {
    rain: 0.1,
    snow: 0.05,
    cloudiness: 25
}
export const CONDITIONS_MAPPINGS = {
    fr: {
        froid: 'cold',
        chaud: 'warm',
        neige: 'snow',
        pluie: 'rain'
        // TODO (after it is ported in the french app)
    },
    en: {
        cold: 'cold',
        warm: 'warm',
        snow: 'snow',
        rain: 'rain',
        clear: 'sun',
        cloudy: 'clouds'
    }
}
export const TEMPERATURE_TRESHOLDS = {
    cold: 10,
    warm: 20
}
