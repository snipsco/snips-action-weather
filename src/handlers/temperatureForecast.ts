import {
    translation,
    logger
} from '../utils'
import commonHandler from './common'
import { Handler } from '.'

export const temperatureForecastHandler: Handler =  async function (msg, flow) {
    const {
        place,
        formattedForecastData,
        intervalsAreTruncated
    } = await commonHandler(msg, { mergeFormattedData: false })

    const speech =
        translation.warnAboutTruncatedIntervals(intervalsAreTruncated) +
        ' ' +
        translation.temperatureToSpeech(formattedForecastData, place)
    logger.info('TTS: %s', speech)

    flow.end()
    return speech
}