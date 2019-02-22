import {
    MIN_THRESHOLDS,
    DAY_LIST
} from '../../constants'
import { time } from '../time'
import { ForecastAccumulator, ForecastAccumulatorItem, ForecastReportWeather, ForecastDayReport } from './types'

const { isToday, isTomorrow } = time

// Get weather report based on collected metrics
function getWeatherReport (rawData: ForecastAccumulatorItem): ForecastReportWeather {
    if(rawData.snow >= MIN_THRESHOLDS.snow) {
        let type = 'snow'
        if(rawData.snow < 1)
            return {
                qualifier: 'light',
                type
            }
        if(rawData.snow < 5)
            return {
                qualifier: 'moderate',
                type
            }
        return {
            qualifier: 'heavy',
            type
        }
    }
    if(rawData.rain >= MIN_THRESHOLDS.rain) {
        let type = 'rain'
        if(rawData.rain < 2.5)
            return {
                qualifier: 'light',
                type
            }
        if(rawData.rain < 7.6)
            return {
                qualifier: 'moderate',
                type
            }
        return {
            qualifier: 'heavy',
            type
        }
    }
    if(rawData.cloudiness >= MIN_THRESHOLDS.cloudiness) {
        let type = 'clouds'
        if(rawData.cloudiness < 50)
            return {
                // quantifier: 'partly',
                // type
                quantifier: 'mostly',
                type: 'sun'
            }
        if(rawData.cloudiness < 70)
            return {
                quantifier: 'mostly',
                type
            }
        return {
            quantifier: '',
            type
        }
    }
    return {
        quantifier: '',
        type: 'sun'
    }
}

// Merge periods having the same weather types
function mergeReports (mainReport: ForecastReportWeather, otherReport: ForecastReportWeather) {
    if (
        mainReport.qualifier !== otherReport.qualifier ||
        mainReport.quantifier !== otherReport.quantifier
    ) {
        mainReport.quantifier = ''
        delete mainReport.qualifier
    }
}

// When merging time periods, recompute the min/max temperature
type Temperature = { min: number, max: number }
function mergeTemperatures (mainTemperature: Temperature, otherTemperature: Temperature) {
    mainTemperature.min = Math.round(Math.min(mainTemperature.min, otherTemperature.min))
    mainTemperature.max = Math.round(Math.max(mainTemperature.max, otherTemperature.max))
}

// Process the collected weather data to add weather reports, and merge time periods that have the same weather type.
export function formatForecast (data: ForecastAccumulator[], { mergeDays = true, mergePeriods = true } = {}) {

    // Add weather report for each day
    data.forEach(day => {
        for(let dayPart in day) {
            day[dayPart].report = getWeatherReport(day[dayPart])
        }
    })

    let daysReport: ForecastDayReport[] = []
    data.forEach(datum => {
        const { day } = datum
        const dayDate = new Date(day.startTime)
        const dateIsToday = isToday(dayDate)
        const dayLabel =
            dateIsToday ? 'today' :
            isTomorrow(dayDate) ? 'tomorrow' :
            DAY_LIST[dayDate.getDay()]

        let dayReport: ForecastDayReport
        function resetReport () {
            dayReport = {
                days: [ dayLabel ],
                labels: new Set(),
                temperatures: {
                    min: null,
                    max: null
                },
                report: null
            }
        }
        resetReport()

        // Full day report - for multiple days we summarize
        if(day.iterations === 8 && data.length > 1) {
            dayReport.report = day.report
            dayReport.temperatures = {
                min: Math.round(day.minTemp),
                max: Math.round(day.maxTemp)
            }

            // Check if we can merge the day report with the previous one
            const lastReport = daysReport.length > 0 && daysReport[daysReport.length - 1]
            if(
                mergeDays &&
                lastReport && lastReport.labels.size === 0 &&
                lastReport.report.type === dayReport.report.type
            ) {
                mergeReports(lastReport.report, dayReport.report)
                mergeTemperatures(lastReport.temperatures, dayReport.temperatures)
                lastReport.days.push(dayLabel)
            } else {
                daysReport.push(dayReport)
            }
            return
        }

        // For a period within a day, we go deeper
        ['morning', 'afternoon', 'evening'].forEach(label => {
            const dayPart: ForecastAccumulatorItem = datum[label]

            if(!dayPart)
                return

            const singleDayPart = datum.day.iterations === 1

            if(dayReport.labels.size > 0 && dayReport.report !== null) {
                // Check previous report and merge if possible
                if(dayReport.report.type === dayPart.report.type && mergePeriods) {
                    // Same type - merge
                    dayReport.labels.add(label)
                    mergeReports(dayReport.report, dayPart.report)
                    mergeTemperatures(dayReport.temperatures, {
                        min: dayPart.minTemp,
                        max: dayPart.maxTemp
                    })
                    return
                } else {
                    daysReport.push(dayReport)
                    resetReport()
                }
            }
            if(dayPart.iterations === 1 && dayPart.timeInterval.rawValue && singleDayPart) {
                dayReport.labels.add(dayPart.timeInterval.rawValue)
                dayReport.customLabel = true
            } else {
                dayReport.labels.add(label)
            }

            dayReport.report = dayPart.report
            dayReport.temperatures = {
                min: Math.round(dayPart.minTemp),
                max: Math.round(dayPart.maxTemp)
            }
        })

        if(dayReport.labels.size > 0 && dayReport.report !== null) {
            daysReport.push(dayReport)
            resetReport()
        }
    })

    return daysReport
}
