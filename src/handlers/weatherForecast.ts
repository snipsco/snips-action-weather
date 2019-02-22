import {
    translation, logger
} from '../utils'
import commonHandler from './common'
import { Handler } from '.'

export const weatherForecastHandler: Handler = async function (msg, flow) {
    const {
        place,
        formattedForecastData,
        intervalsAreTruncated
    } = await commonHandler(msg, { mergeFormattedData: true })

    const speech =
        translation.warnAboutTruncatedIntervals(intervalsAreTruncated) +
        ' ' +
        translation.forecastToSpeech(formattedForecastData, place)
    logger.info('TTS: %s', speech)

    flow.end()
    return speech
}