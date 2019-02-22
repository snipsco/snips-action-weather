import wretch from 'wretch'
import { throttlingCache } from 'wretch-middlewares'
import { HOUR_MILLISECONDS } from '../constants'
import { configFactory } from './configFactory'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'

let http = wretch(BASE_URL)

function init(httpOptions = { mock: false }) {
    http = http.polyfills({
        fetch: httpOptions.mock || require('node-fetch')
    }).query({
        units: 'metric',
        appid: configFactory.get().apiKey
    })

    if(!httpOptions.mock) {
        http = http.middlewares([
            // Add a dedupe middleware, throttling cache would also be useful to prevent excessive token usage.
            // (https://github.com/elbywan/wretch-middlewares)
            throttlingCache({
                throttle: HOUR_MILLISECONDS / 6
            })
        ])
    }
}
function get() {
    return http
}

export const httpFactory = {
    init,
    get
}
