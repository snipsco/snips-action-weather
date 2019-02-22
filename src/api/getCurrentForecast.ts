import { httpFactory } from '../factories'
import { CurrentWeatherData } from './types'

// Get forecast for the current time at a specific location.
export async function getCurrentForecast (geonameid: string): Promise<CurrentWeatherData> {
    const http = httpFactory.get()

    const result = await http.url('/weather')
            .query({
                id: geonameid
            })
            .get()
            .json()
            .catch(error => {
                // Network error
                if(error.name === 'TypeError')
                    throw new Error('APIRequest')
                // Other error
                throw new Error('APIResponse')
            }) as CurrentWeatherData

        if(result.cod !== 200) {
            throw new Error(result.cod === 404 ? 'place' : 'APIResponse')
        }

        return result
}