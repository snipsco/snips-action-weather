import { TimeInterval } from '../utils'

export type ForecastData = {
    dt: number,
    dt_txt: string,
    main: {
        temp: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        sea_level: number,
        grnd_level: number,
        humidity: number,
        temp_kf: number
    },
    weather: {
        id: 800,
        main: string,
        description: string,
        icon: string
    }[],
    clouds: {
        all: number
    },
    wind: {
        speed: number,
        deg: number
    },
    rain?: {
        '3h'?: number
    },
    snow?: {
        '3h'?: number
    },
    timeInterval: TimeInterval
}

export type ForecastPayload = {
    cod: string,
    city?: {
        id: number,
        name: string,
        coord: {
            lat: number,
            lon: number
        },
        country: string
    },
    list?: ForecastData[]
}

export type CurrentWeatherData = {
    cod: number,
    dt?: number,
    coord?: {
        lat: number,
        lon: number
    },
    weather?: {
        id: 800,
        main: string,
        description: string,
        icon: string
    }[],
    main?: {
        temp: number,
        temp_min: number,
        temp_max: number,
        pressure: number
        humidity: number
    },
    visibility?: number,
    wind?: {
        speed: number,
        deg: number
    },
    rain?: {
        '1h'?: number
    },
    clouds?: {
        all: number
    },
    id?: number,
    name?: string
}
