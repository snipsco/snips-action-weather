import { translation, logger } from '../utils'
import { FlowContinuation, IntentMessage, FlowActionReturn } from 'hermes-javascript'
import { temperatureForecastHandler } from './temperatureForecast'
import { weatherConditionHandler } from './weatherCondition'
import { weatherForecastHandler } from './weatherForecast'

export type Handler = (
    message: IntentMessage,
    flow: FlowContinuation,
    ...args: any[]
) => FlowActionReturn

// Wrap handlers to gracefully capture errors
const handlerWrapper = (handler: Handler): Handler => (
    async (message, flow, ...args) => {
        logger.debug('message: %O', message)
        try {
            // Run handler until completion
            const tts = await handler(message, flow, ...args)
            // And make the TTS speak
            return tts
        } catch (error) {
            // If an error occurs, end the flow gracefully
            flow.end()
            // And make the TTS output the proper error message
            logger.error(error)
            return await translation.errorMessage(error)
        }
    }
)

// Add handlers here, and wrap them.
export default {
    temperatureForecast: handlerWrapper(temperatureForecastHandler),
    weatherCondition: handlerWrapper(weatherConditionHandler),
    weatherForecast: handlerWrapper(weatherForecastHandler)
}