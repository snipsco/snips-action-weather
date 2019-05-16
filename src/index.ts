import { Hermes, Done } from 'hermes-javascript'
import { mappingsFactory } from './factories'
import { config, i18n, logger } from 'snips-toolkit'
import handlers from './handlers'

// Enables deep printing of objects.
process.env.DEBUG_DEPTH = undefined
// Replace 'error' with '*' to log everything
logger.enable('error')

export default async function ({
    hermes,
    done
}: {
    hermes: Hermes,
    done: Done
}) {
    try {
        config.init()
        await i18n.init(config.get().locale)
        mappingsFactory.init(config.get().locale)

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
    } catch (error) {
        // Output initialization errors to stderr and exit
        const message = await i18n.errorMessage(error)
        logger.error(message)
        logger.error(error)
        // Exit
        done()
    }
}
