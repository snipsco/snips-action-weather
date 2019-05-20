SnipsToolkit.mock.http(fetchMock => {
    const nycForecast = require('./samples/forecast_5128581.json')
    const nycWeather = require('./samples/weather_5128581.json')

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
})
