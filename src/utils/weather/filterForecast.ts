import { FORECAST_PERIOD } from '../../constants'
import { TimeInterval } from '../time'
import { ForecastData } from '../../api'

export function filterForecastInterval(fullForecast: ForecastData[], timeInterval: TimeInterval) {
    return filterForecastByIntervals(fullForecast, [timeInterval])
}

// Filter raw weather data segments and keep the ones that intersect with the given time intervals.
export function filterForecastByIntervals(fullForecast: ForecastData[], timeIntervals: TimeInterval[]): ForecastData[] {
    const filteredForecast = fullForecast.filter(segment => {
        const time = new Date(segment.dt * 1000).getTime()

        const matchingInterval = timeIntervals.find(interval => (
            (time >= interval.from && time < interval.to) ||
            ((interval.to - interval.from) <= FORECAST_PERIOD && ((interval.from >= time && interval.from < (time + FORECAST_PERIOD))))
        ))
        if (matchingInterval)
            segment.timeInterval = matchingInterval

        return matchingInterval
    })

    if (filteredForecast.length < 1) {
        throw new Error('intersection')
    }
    return filteredForecast
}
