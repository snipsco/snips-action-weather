import { i18n } from 'snips-toolkit'
import { ForecastDayReport } from './weather'
import { trimStart } from './string'

export const translation = {
    // Joins pieces of text with a conjunction (and)
    joinTerms(list: string[]) {
        if(!list || list.length < 2)
            return list && list[0] || ''

        let joinedString = ''
        for (let i = 0; i < list.length; i++) {
            const element = list[i]

            if(i === (list.length - 1)) {
                joinedString += ' ' + i18n.translate('joins.andSomething', { something: element }) + ' '
                continue
            } else if(i > 0) {
                joinedString += ', '
            }

            joinedString += element
        }
        return joinedString
    },

    forecastToSpeech(formattedWeatherData: ForecastDayReport[], place?: string) {
        let lastDay: string = null
        let firstDay = true

        const { joinTerms } = translation

        return formattedWeatherData.reduce((speech, day) => {
            let time = ''
            let predictions = ''
            let temperatures = ''

            const sameDay = lastDay === day.days[0]
            lastDay = day.days[day.days.length - 1]

            if (day.labels.size === 0 && !sameDay) {
                time = joinTerms(day.days.map(day => i18n.translate('days.' + day)))
            } else {
                if (!sameDay && !day.customLabel)
                    time = i18n.translate('days.' + day.days[0]) + ', '

                if (Array.from(day.labels).length < 3)
                    time += joinTerms(Array.from(day.labels).map(label => i18n.translate(['partOfDay.' + label, label || ''])))
            }

            const weatherAdjective = ('quantifier' in day.report) ? 'quantifier' : 'qualifier'

            const weather =
                i18n.translate([weatherAdjective + '.' + day.report[weatherAdjective], '']) +
                ' ' +
                i18n.translate('weatherTypes.' + weatherAdjective + '.' + day.report.type)
            predictions += i18n.randomTranslation('forecast.weather.prediction.' + weatherAdjective, { weather })

            if (Math.abs(day.temperatures.min - day.temperatures.max) > 4) {
                temperatures += i18n.randomTranslation('forecast.weather.temperatures.range', {
                    minTemp: day.temperatures.min,
                    maxTemp: day.temperatures.max
                })
            } else {
                temperatures += i18n.randomTranslation('forecast.weather.temperatures.exact', {
                    temperature: Math.floor((day.temperatures.min + day.temperatures.max) / 2)
                })
            }

            const daySentence = trimStart(i18n.translate('forecast.weather.day', {
                time,
                predictions,
                temperatures,
                place: firstDay && place ? place : null,
                context: firstDay && place ? 'place' : null
            }))

            firstDay = false

            speech += daySentence.charAt(0).toUpperCase() + daySentence.slice(1) + '\n'
            return speech
        }, '')
    },

    temperatureToSpeech(formattedWeatherData: ForecastDayReport[], place?: string): string {
        const { joinTerms } = translation
        let lastDay: string = null
        let firstDay = true

        return formattedWeatherData.reduce((speech, day) => {
            let time = ''
            let temperatures = ''

            const sameDay = lastDay === day.days[0]
            lastDay = day.days[day.days.length - 1]

            if (day.labels.size === 0 && !sameDay) {
                time = joinTerms(day.days.map(day => i18n.translate('days.' + day)))
            } else {
                if (!sameDay && !day.customLabel)
                    time = i18n.translate('days.' + day.days[0]) + ', '

                if (Array.from(day.labels).length < 3)
                    time += joinTerms(Array.from(day.labels).map(label => i18n.translate(['partOfDay.' + label, label || ''])))
            }

            if (Math.abs(day.temperatures.min - day.temperatures.max) > 4) {
                temperatures += i18n.randomTranslation('forecast.temperatures.temperatures.range', {
                    minTemp: day.temperatures.min,
                    maxTemp: day.temperatures.max
                })
            } else {
                temperatures += i18n.randomTranslation('forecast.temperatures.temperatures.exact', {
                    temperature: Math.floor((day.temperatures.min + day.temperatures.max) / 2)
                })
            }

            const daySentence = trimStart(i18n.translate('forecast.temperatures.day', {
                time,
                temperatures,
                place: firstDay && place ? place : null,
                context: firstDay && place ? 'place' : null
            }))

            firstDay = false

            speech += daySentence.charAt(0).toUpperCase() + daySentence.slice(1) + '\n'
            return speech
        }, '')
    },

    conditionToSpeech (name: string, condition: string, place: string) {
        return i18n.randomTranslation(`forecast.conditional.${condition}.${name}`, { place }) + '\n'
    },

    warnAboutTruncatedIntervals(isTruncated: boolean): string {
        return isTruncated ? i18n.translate('warning.truncatedIntervals') : ''
    }
}
