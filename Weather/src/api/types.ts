// Canonical weather shape used by the UI layer.
export interface WeatherCurrent {
    city: string;
    country: string;
    temperature: number;
    description: string;
    feelsLike: number;
    weatherType: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    cloudiness: number;
}

export interface WeatherHour {
    time: string;
    weatherType: string;
    temperature: number;
}

export interface WeatherForecastDay {
    day: string;
    date: string;
    hours: WeatherHour[];
}

export interface WeatherData {
    current: WeatherCurrent;
    forecast: WeatherForecastDay[];
}
