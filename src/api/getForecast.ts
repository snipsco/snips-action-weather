import { logger } from 'snips-toolkit'
import { request } from './index'
import { getCurrentForecast } from './getCurrentForecast'
import { HOUR_MILLISECONDS } from '../constants'
import { ForecastData, ForecastPayload, CurrentWeatherData } from './types'

// Get forecast predictions for a specific location.
export async function getForecast(geonameid: string): Promise<ForecastData[]> {
    const results = await request.url('/forecast')
        .query({
            id: geonameid
        })
        .get()
        .json()
        .catch((error: Error) => {
            logger.error(error)
            // Network error
            if (error.name === 'TypeError')
                throw new Error('APIRequest')
            // Other error
            throw new Error('APIResponse')
        }) as ForecastPayload

    if (results.cod !== '200') {
        logger.error(results)
        throw new Error(results.cod === '404' ? 'place' : 'APIResponse')
    }

    const currentWeather = await getCurrentForecast(geonameid) as ForecastData & CurrentWeatherData

    // Format the current weather data to comply with the 3 hours API
    ['snow', 'rain'].forEach(weather => {
        if (currentWeather[weather]) {
            currentWeather[weather]['3h'] = currentWeather[weather]['1h']
        } else {
            currentWeather[weather] = {}
        }
    })
    // Set the time in order to not overlap with other time ranges
    currentWeather.dt = (results.list[0].dt * 1000 - 3 * HOUR_MILLISECONDS) / 1000
    currentWeather.dt_txt = new Date(currentWeather.dt * 1000).toISOString()

    return [
        currentWeather,
        ...results.list
    ]
}
