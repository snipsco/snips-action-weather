import { http } from 'snips-toolkit'
import { BASE_URL } from '../constants'

export const request = http(BASE_URL)

export * from './getForecast'
export * from './getCurrentForecast'
export * from './types'
