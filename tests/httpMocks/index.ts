import { FetchMockStatic } from 'fetch-mock'

const nycForecast = require('./samples/forecast_5128581.json')
const nycWeather = require('./samples/weather_5128581.json')

// Fix global date
const BackupedDate = global.Date
const monkeyPatchedDate = function Date(arg) {
    return new BackupedDate(arg || Date.now())
}
monkeyPatchedDate.now = () => 1550835788763
monkeyPatchedDate.parse = BackupedDate.parse
monkeyPatchedDate.UTC = BackupedDate.UTC
global.Date = monkeyPatchedDate as any

/* Change the dates so that it reflects the current day */
nycWeather.dt = Date.now() / 1000
nycForecast.list.forEach((interval, index) => {
    const date = new Date(Date.now() + index * 1000 * 60 * 60 * 3)
    interval.dt = date.getTime() / 1000
    interval.dt_txt = date.toISOString()
})

export function mock(fetchMock: FetchMockStatic) {
    // Chain mocks - see http://www.wheresrhys.co.uk/fetch-mock for API details

    // Request weather for New York City for the next 5 days.
    fetchMock.mock('https://api.openweathermap.org/data/2.5/forecast', nycForecast, {
        query: {
            id: '5128581'
        }
    })

    // Request current NYC weather.
    fetchMock.mock('https://api.openweathermap.org/data/2.5/weather', nycWeather, {
        query: {
            id: '5128581'
        }
    })

    return fetchMock
}
