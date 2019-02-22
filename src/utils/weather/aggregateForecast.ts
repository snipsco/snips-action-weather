import { MIN_THRESHOLDS } from '../../constants'
import { periods } from './constants'
import { ForecastData } from '../../api'
import { ForecastAccumulatorItem, ForecastAccumulator } from './types'

function resetAccumulatorItem(date: Date): ForecastAccumulatorItem {
    return {
        startTime: date && date.getTime() || null,
        endTime: date && date.getTime() || null,
        maxTemp: null,
        minTemp: null,
        iterations: 0,
        cloudiness: 0,
        rain: 0,
        snow: 0,
        counters: {
            rain: 0,
            snow: 0
        }
    }
}

function updateAccumulatorItem (date: Date, accumulatorItem: ForecastAccumulatorItem, forecastInterval: ForecastData, day = false) {
    // Take the min/max temps
    if(accumulatorItem.maxTemp === null || accumulatorItem.maxTemp < forecastInterval.main.temp) {
        accumulatorItem.maxTemp = forecastInterval.main.temp
    }
    if(accumulatorItem.minTemp === null || accumulatorItem.minTemp > forecastInterval.main.temp) {
        accumulatorItem.minTemp = forecastInterval.main.temp
    }
    // Sum up the cloudiness / rain / snow
    if(forecastInterval.clouds) {
        accumulatorItem.cloudiness = accumulatorItem.cloudiness + forecastInterval.clouds.all || 0
    }
    if(forecastInterval.rain) {
        const amount = forecastInterval.rain['3h'] || 0
        accumulatorItem.rain += amount
        if(amount >= MIN_THRESHOLDS.rain * 3)
            accumulatorItem.counters.rain++
    }
    if(forecastInterval.snow) {
        const amount = forecastInterval.snow['3h'] || 0
        accumulatorItem.snow += amount
        if(amount >= MIN_THRESHOLDS.snow * 3)
            accumulatorItem.counters.snow++
    }
    if(!day) {
        accumulatorItem.timeInterval = forecastInterval.timeInterval
    }
    if(accumulatorItem.iterations === 0)
            accumulatorItem.startTime = date.getTime()
    accumulatorItem.endTime = date.getTime()
    accumulatorItem.iterations++
}

function finalizeAccumulatorItem (accumulatorItem: ForecastAccumulatorItem) {
    accumulatorItem.cloudiness = accumulatorItem.cloudiness / accumulatorItem.iterations
    // We use (iterations * 3) because we want a number in millimeters per hours,
    // and the weather data has a period of 3 hours
    accumulatorItem.rain = accumulatorItem.rain / (accumulatorItem.iterations * 3)
    accumulatorItem.snow = accumulatorItem.snow / (accumulatorItem.iterations * 3)
}

function updateAccumulator (date: Date, accumulator: ForecastAccumulator, forecastInterval: ForecastData) {
    const hour = date.getHours() + 1

    let period = 'evening'
    if(hour < 12) {
        period = 'morning'
    }
    if(hour >= 12 && hour < 18) {
        period = 'afternoon'
    }

    updateAccumulatorItem(date, accumulator[period], forecastInterval)
    updateAccumulatorItem(date, accumulator.day, forecastInterval, true)
}

function finalizeAccumulator (accumulator: ForecastAccumulator) {
    periods.forEach(period => {
        if(accumulator[period].iterations === 0) {
            delete accumulator[period]
        } else {
            finalizeAccumulatorItem(accumulator[period])
        }
    })
}


// Takes raw weather data every 3 hours interval, aggregate the data and group by day & part of the day
export function aggregateForecast (forecastData: ForecastData[]) {
    const finalData: ForecastAccumulator[] = []

    let day: number = null
    let accumulator: ForecastAccumulator = null

    const resetAccumulator = (date: Date): ForecastAccumulator => {
        const accumulator = {}
        periods.forEach(period => {
            accumulator[period] = resetAccumulatorItem(date)
        })
        return accumulator
    }

    function pushAccumulator (date: Date) {
        if(accumulator) {
            // Calculate means and store the accumulator
            finalizeAccumulator(accumulator)
            if(Object.keys(accumulator).length > 0)
                finalData.push(accumulator)
        }
        if(date) {
            accumulator = resetAccumulator(date)
        }
    }

    forecastData.forEach(forecastInterval => {
        const date = new Date(forecastInterval.dt * 1000)

        if(day === null || date.getDay() !== day) {
            day = date.getDay()
            pushAccumulator(date)
        }
        updateAccumulator(date, accumulator, forecastInterval)
    })

    if(accumulator)
        pushAccumulator(null)

    return finalData
}