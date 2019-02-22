import { TimeInterval } from '../time'

export type ForecastAccumulator = {
    day?: ForecastAccumulatorItem,
    morning?: ForecastAccumulatorItem,
    afternoon?: ForecastAccumulatorItem,
    evening?: ForecastAccumulatorItem
}
export type ForecastAccumulatorItem = {
    startTime: number,
    endTime: number,
    maxTemp: number,
    minTemp: number,
    iterations: number,
    cloudiness: number,
    rain: number,
    snow: number,
    counters: {
        rain: number,
        snow: number
    },
    timeInterval?: TimeInterval,
    report?: ForecastReportWeather
}
export type ForecastReportWeather = {
    qualifier?: 'light' | 'moderate' | 'heavy',
    quantifier?: 'mostly' | '',
    type: string
}
export type ForecastDayReport = {
    days: string[],
    labels: Set<string>,
    temperatures: {
        min: number,
        max: number
    },
    report: ForecastReportWeather,
    customLabel?: boolean
}
