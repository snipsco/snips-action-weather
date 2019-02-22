import { withHermes } from 'hermes-javascript'
import bootstrap from './bootstrap'
import handlers from './handlers'
import { translation, logger } from './utils'

// Initialize hermes
export default function ({
    hermesOptions = {},
    bootstrapOptions = {}
} = {}) : Promise<() => void>{
    return new Promise((resolve, reject) => {
        withHermes(async (hermes, done) => {
            try {
                // Bootstrap config, locale, i18n…
                await bootstrap(bootstrapOptions)

                const dialog = hermes.dialog()

                // Subscribe to the app intents
                dialog.flows([
                    {
                        intent: 'snips-assistant:WeatherForecast',
                        action : handlers.weatherForecast
                    },
                    {
                        intent: 'snips-assistant:TemperatureForecast',
                        action: handlers.temperatureForecast
                    },
                    {
                        intent: 'snips-assistant:WeatherConditionRequest',
                        action: handlers.weatherCondition
                    }
                ])
                resolve(done)
            } catch (error) {
                // Output initialization errors to stderr and exit
                const message = await translation.errorMessage(error)
                logger.error(message)
                logger.error(error)
                // Exit
                done()
                // Reject
                reject(error)
            }
        }, hermesOptions)
    })
}