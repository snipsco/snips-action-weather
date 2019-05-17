import { logger } from 'snips-toolkit'
import { request } from './index'
import { CurrentWeatherData } from './types'

// Get forecast for the current time at a specific location.
export async function getCurrentForecast(geonameid: string): Promise<CurrentWeatherData> {
    const result = await request.url('/weather')
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
            }) as CurrentWeatherData

        if (result.cod !== 200) {
            logger.error(result)
            throw new Error(result.cod === 404 ? 'place' : 'APIResponse')
        }

        return result
}
