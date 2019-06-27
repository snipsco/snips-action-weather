import { Handler, config, message, logger } from 'snips-toolkit'
import {
    translation
} from '../utils'
import * as weather from '../utils/weather'
import {
    CONDITIONS_MAPPINGS,
    TEMPERATURE_TRESHOLDS
} from '../constants'
import commonHandler from './common'

import { NluSlot, slotType } from 'hermes-javascript/types'

export const weatherConditionHandler: Handler = async function (msg, flow) {

    const language = config.get().locale
    const conditionSlot: NluSlot<slotType.custom> = message.getSlotsByName(msg, 'condition_name', { onlyMostConfident: true })

    if(!conditionSlot) {
        throw new Error('intentNotRecognized')
    }

    const conditionName = CONDITIONS_MAPPINGS[language][conditionSlot.value.value]

    if(!conditionName) {
        throw new Error('intentNotRecognized')
    }

    const {
        place,
        aggregatedForecastData,
        intervalsAreTruncated
    } = await commonHandler(msg, { mergeFormattedDataByType: true })

    let speech = translation.warnAboutTruncatedIntervals(intervalsAreTruncated) + ' '
    if(conditionName === 'cold' || conditionName === 'warm') {
        const formattedTemperatureData = weather.formatForecast(aggregatedForecastData, {
            forceMergePeriods: true
        })

        // Temperature
        const filteredReports = formattedTemperatureData.filter(report => {
            const meanTemperature = (report.temperatures.min + report.temperatures.max) / 2
            const threshold = TEMPERATURE_TRESHOLDS[conditionName]
            return conditionName === 'cold' ?
                meanTemperature <= threshold :
                meanTemperature >= threshold
        })
        if(filteredReports.length === 0) {
            speech += translation.conditionToSpeech(conditionName, 'no', place)
            speech += translation.temperatureToSpeech(formattedTemperatureData)
        } else {
            speech += translation.conditionToSpeech(conditionName, 'yes', place)
            speech += translation.temperatureToSpeech(filteredReports)
        }
    } else {
        const formattedForecastData = weather.formatForecast(aggregatedForecastData, {
            forceMergePeriods: true
        })

        // Weather types
        const filteredReports = formattedForecastData.filter(report => (
            report.report.type === conditionName
        ))
        if(filteredReports.length === 0) {
            speech += translation.conditionToSpeech(conditionName, 'no', place)
            speech += translation.forecastToSpeech(formattedForecastData)
        } else {
            speech += translation.conditionToSpeech(conditionName, 'yes', place)
            speech += translation.forecastToSpeech(filteredReports)
        }
    }

    // const speech = translation.forecastToSpeech(formattedForecastData, place)
    logger.info('TTS: %s', speech)

    flow.end()
    return speech
}
