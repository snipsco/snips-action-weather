import { Hermes, Done } from 'hermes-javascript'
import { config, i18n, logger } from 'snips-toolkit'
import { mappings } from './utils'
import * as api from './api'
import handlers from './handlers'

// Enables deep printing of objects.
process.env.DEBUG_DEPTH = undefined

export default async function ({
    hermes,
    done
}: {
    hermes: Hermes,
    done: Done
}) {
    try {
        const { name } = require('../package.json')
        logger.init(name)
        // Replace 'error' with '*' to log everything
        logger.enable('error')

        config.init()
        await i18n.init(config.get().locale)
        mappings.init(config.get().locale)
        api.init()

        if (!config.get().apiKey) {
            throw new Error('noAPIKey')
        }

        const dialog = hermes.dialog()

        // Subscribe to the app intents
        dialog.flows([
            {
                intent: `${ config.get().assistantPrefix }:WeatherForecast`,
                action: handlers.weatherForecast
            },
            {
                intent: `${ config.get().assistantPrefix }:TemperatureForecast`,
                action: handlers.temperatureForecast
            },
            {
                intent: `${ config.get().assistantPrefix }:WeatherConditionRequest`,
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
