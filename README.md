# snips-action-weather

Snips action code for the Weather app

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

## Setup

```sh
# Install the dependencies, builds the action and creates the config.ini file.
sh setup.sh
```

Don't forget to edit the `config.ini` file.

To be able to make calls to the API, you must have a [OpenWeatherMap API key](https://openweathermap.org/api).

An assistant containing the intents listed below must be installed on your system. Deploy it following [these instructions](https://docs.snips.ai/articles/console/actions/deploy-your-assistant).

## Run

- Dev mode:

```sh
# Dev mode watches for file changes and restarts the action.
npm run dev
```

- Prod mode:

```sh
# 1) Lint, transpile and test.
npm start
# 2) Run the action.
node action-weather.js
```

## Test & Demo cases

This app only supports french 🇫🇷 and english 🇬🇧.

### `WeatherForecast`

#### Ask for current weather or weather forecast at a given location for a specific date

Get the weather forecast at a given location
> *Hey Snips, what will be the weather for tuesday?*

Get the weather forecast for a specific date
> *Hey Snips, the weather for Seffner in Belarus?*

Get the weather forecast at a given location for a specific date
> *Hey Snips, tell me the weather for the day after tomorrow in Ohio*

### `TemperatureForecast`

#### Ask for a temperature report a given location and a given date

Get the temperature report for the given location
> *Hey Snips, what's the current temperature in Paris?*

Get the temperature report for a specific date
> *Hey Snips, temperature forcast for tonight*

Get the weather forecast for the given location for a specific date
> *Hey Snips, give me the predicted temperatures for Spain over the week*

### `WeatherConditionRequest`

#### Ask specific questions about weather / forecast in a certain location

Ask for a specific question about the weather including a date
> *Hey Snips, should I expect rain today?*
> *Hey Snips, should I take my umbrella?*

Ask for a specific question about the weather including a location and a date
> *Hey Snips, should we expect snow flakes this afternoon at 6pm in France?*

## Debug

In the `action-weather.js` file:

```js
// Uncomment this line to print everything
// debug.enable(name + ':*')
```

## Test

*Requires [mosquitto](https://mosquitto.org/download/) to be installed.*

```sh
npm run test
```

**In test mode, i18n output and http calls are mocked.**

- **http**: see `tests/httpMocks/index.ts`
- **i18n**: see `src/factories/i18nFactory.ts`