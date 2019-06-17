SnipsToolkit.mock.globals(globals => {
    const nycForecast = require('./samples/forecast_5128581.json')
    const nycWeather = require('./samples/weather_5128581.json')

    // Fix global date
    const BackupedDate = global.Date
    const freezedTime = 1550835788763
    const monkeyPatchedDate = function Date(arg: string | number | Date) {
        return new BackupedDate(arg || freezedTime)
    }
    monkeyPatchedDate.now = () => freezedTime
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

    globals.Date = monkeyPatchedDate
})
