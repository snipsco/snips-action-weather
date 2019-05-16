import { handler } from 'snips-toolkit'
import { temperatureForecastHandler } from './temperatureForecast'
import { weatherConditionHandler } from './weatherCondition'
import { weatherForecastHandler } from './weatherForecast'

// Add handlers here, and wrap them.
export default {
    temperatureForecast: handler.wrap(temperatureForecastHandler),
    weatherCondition: handler.wrap(weatherConditionHandler),
    weatherForecast: handler.wrap(weatherForecastHandler)
}
