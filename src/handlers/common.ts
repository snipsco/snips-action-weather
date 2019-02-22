import { IntentMessage, slotType, NluSlot } from 'hermes-javascript'
import {
    time,
    message,
    location,
    logger,
    TimeSlot
} from '../utils'
import * as weather from '../utils/weather'
import { INTENT_THRESHOLD, ASR_THRESHOLD } from '../constants'
import { getForecast } from '../api'


/* Common logic performed for various intents */
export default async function (msg: IntentMessage, { mergeFormattedData = false } = {}) {

    if(msg.intent.confidenceScore < INTENT_THRESHOLD || message.getAsrConfidence(msg) < ASR_THRESHOLD) {
        throw new Error('intentNotRecognized')
    }

    /* Extract slots */
    const timeSlots: TimeSlot[] = message.getSlotsByName(msg, 'forecast_datetime')
    const countrySlot: NluSlot<slotType.custom> = message.getSlotsByName(msg, 'country', { onlyMostConfident: true })
    const regionSlot: NluSlot<slotType.custom> = message.getSlotsByName(msg, 'region', { onlyMostConfident: true })
    const citySlot: NluSlot<slotType.custom> = message.getSlotsByName(msg, 'city', { onlyMostConfident: true })

    /* Merge time slot values into time intervals */
    const [timeIntervals, intervalsAreTruncated] = time.extractTimeIntervals(timeSlots)

    /* Extract target geonameid and name */
    const { geonameid: geoNameId, value: place, countryName } = location.extractGeoNameIdAndPlace(countrySlot, regionSlot, citySlot)

    logger.debug('timeIntervals: %O', timeIntervals)
    logger.debug('geoNameId: %s', geoNameId)
    logger.debug('place: %s', place)
    logger.debug('country name: %s', countryName)

    /* Perform an api call to retrieve the full forecast data at the target location */
    const fullForecast = await getForecast(geoNameId)
    /* And then filter the results based on the required time intervals */
    const forecastData = weather.filterForecastByIntervals(fullForecast, timeIntervals)

    logger.debug('filtered forecast data: %O', forecastData.map(_ => ({
        weather: _.weather,
        clouds: _.clouds,
        rain: _.rain,
        snow: _.snow,
        date: _.dt_txt
    })))

    /* Process the forecast 3 hours intervals into a list containing aggregated weather data grouped by days and day periods. */
    const aggregatedForecastData = weather.aggregateForecast(forecastData)
    logger.debug('aggregated forecast data: %O', aggregatedForecastData)

    /*
        Format the data into a list of time periods having i18n keys and weather reports
        and grouped by adjacent periods and weather type.
     */
    const formattedForecastData = weather.formatForecast(aggregatedForecastData, {
        mergeDays: mergeFormattedData,
        mergePeriods: mergeFormattedData
    })
    logger.info('formatted forecast data: %O', formattedForecastData)

    return {
        place: countryName ? place + ' ' + countryName : place,
        aggregatedForecastData,
        formattedForecastData,
        intervalsAreTruncated
    }
}