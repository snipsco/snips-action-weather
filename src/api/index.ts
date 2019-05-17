import { http, config } from 'snips-toolkit'
import { BASE_URL } from '../constants'

export let request = http(BASE_URL)

export function init() {
    request = request.query({
        units: 'metric',
        appid: config.get().apiKey
    })
}

export * from './getForecast'
export * from './getCurrentForecast'
export * from './types'
