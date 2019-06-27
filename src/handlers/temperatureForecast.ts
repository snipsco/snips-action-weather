import { Handler, logger } from 'snips-toolkit'
import {
    translation
} from '../utils'
import commonHandler from './common'

export const temperatureForecastHandler: Handler =  async function (msg, flow) {
    const {
        place,
        formattedForecastData,
        intervalsAreTruncated
    } = await commonHandler(msg, { forceMergePeriods: true })

    const speech =
        translation.warnAboutTruncatedIntervals(intervalsAreTruncated) +
        ' ' +
        translation.temperatureToSpeech(formattedForecastData, place)
    logger.info('TTS: %s', speech)

    flow.end()
    return speech
}
