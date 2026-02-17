import { apiRequest } from "./client";
import type { WeatherCurrent, WeatherData, WeatherForecastDay, WeatherHour } from "./types";

const WEATHER_ENDPOINT = import.meta.env.VITE_API_WEATHER_ENDPOINT ?? "/api/weather";

const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const dateFormatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
});
const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
});

function asRecord(value: unknown): Record<string, unknown> {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }
    return {};
}

// Reads the first non-empty string from a list of possible keys.
function readString(
    source: Record<string, unknown>,
    keys: string[],
    fallback = "",
): string {
    for (const key of keys) {
        const value = source[key];
        if (typeof value === "string" && value.trim().length > 0) {
            return value.trim();
        }
    }
    return fallback;
}

// Reads number from different key candidates and tolerates string numbers.
function readNumber(
    source: Record<string, unknown>,
    keys: string[],
    fallback = 0,
): number {
    for (const key of keys) {
        const value = source[key];

        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }

        if (typeof value === "string" && value.trim().length > 0) {
            const parsed = Number(value.replace(",", "."));
            if (Number.isFinite(parsed)) {
                return parsed;
            }
        }
    }

    return fallback;
}

// Supports unix timestamp (seconds/millis), ISO strings and Date instances.
function toDate(value: unknown): Date | null {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
        const millis = value > 1_000_000_000_000 ? value : value * 1_000;
        const fromNumber = new Date(millis);
        return Number.isNaN(fromNumber.getTime()) ? null : fromNumber;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) {
            return null;
        }

        if (/^\d+$/.test(trimmed)) {
            return toDate(Number(trimmed));
        }

        const fromString = new Date(trimmed);
        return Number.isNaN(fromString.getTime()) ? null : fromString;
    }

    return null;
}

// Normalizes backend weather values to icon-friendly UI values.
function normalizeWeatherType(raw: string): string {
    const value = raw.toLowerCase();

    if (value.includes("clear") || value.includes("sun")) {
        return "clear";
    }
    if (value.includes("thunder")) {
        return "thunderstorm";
    }
    if (value.includes("drizzle")) {
        return "drizzle";
    }
    if (value.includes("rain")) {
        return "rain";
    }
    if (value.includes("snow")) {
        return "snow";
    }
    if (value.includes("fog") || value.includes("mist") || value.includes("haze")) {
        return "fog";
    }
    if (value.includes("cloud")) {
        return "cloud";
    }

    return value || "cloud";
}

function readWeatherType(source: Record<string, unknown>): string {
    const direct = readString(source, ["weatherType", "main", "type"]);
    if (direct) {
        return normalizeWeatherType(direct);
    }

    const weatherValue = source.weather;
    if (Array.isArray(weatherValue) && weatherValue.length > 0) {
        const firstWeather = asRecord(weatherValue[0]);
        const fromArray = readString(firstWeather, ["main", "description", "type"]);
        if (fromArray) {
            return normalizeWeatherType(fromArray);
        }
    }

    const weatherObject = asRecord(weatherValue);
    const fromObject = readString(weatherObject, ["main", "description", "type"]);
    if (fromObject) {
        return normalizeWeatherType(fromObject);
    }

    return "cloud";
}

function readDescription(source: Record<string, unknown>): string {
    const direct = readString(source, ["description", "weatherDescription", "summary"]);
    if (direct) {
        return direct;
    }

    const weatherValue = source.weather;
    if (Array.isArray(weatherValue) && weatherValue.length > 0) {
        const firstWeather = asRecord(weatherValue[0]);
        const fromArray = readString(firstWeather, ["description", "main"]);
        if (fromArray) {
            return fromArray;
        }
    }

    const weatherObject = asRecord(weatherValue);
    const fromObject = readString(weatherObject, ["description", "main"]);
    if (fromObject) {
        return fromObject;
    }

    return "";
}

function formatTime(value: unknown): string {
    const parsedDate = toDate(value);
    if (parsedDate) {
        return timeFormatter.format(parsedDate);
    }

    if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
    }

    return "--:--";
}

function mapHour(rawHour: unknown): WeatherHour {
    const source = asRecord(rawHour);
    const mainSource = asRecord(source.main);

    const dateValue =
        source.time ??
        source.dateTime ??
        source.datetime ??
        source.dt_txt ??
        source.timestamp ??
        source.dt;

    const mainTemp = readNumber(mainSource, ["temp"], Number.NaN);
    const temperature = Number.isFinite(mainTemp)
        ? mainTemp
        : readNumber(source, ["temperature", "temp"], 0);

    return {
        time: formatTime(dateValue),
        weatherType: readWeatherType(source),
        temperature,
    };
}

function mapForecastDay(rawDay: unknown): WeatherForecastDay {
    const source = asRecord(rawDay);
    const dateValue = source.date ?? source.dayDate ?? source.datetime ?? source.timestamp ?? source.dt;
    const parsedDate = toDate(dateValue);

    const day = readString(source, ["day"], parsedDate ? dayFormatter.format(parsedDate) : "Day");
    const date = readString(
        source,
        ["date"],
        parsedDate ? dateFormatter.format(parsedDate) : "--",
    );

    const hoursSource = Array.isArray(source.hours)
        ? source.hours
        : Array.isArray(source.hourly)
            ? source.hourly
            : [];

    return {
        day,
        date,
        hours: hoursSource.map(mapHour).slice(0, 8),
    };
}

// Fallback for backends that return a flat list of forecast slots.
function groupFlatForecast(hours: unknown[]): WeatherForecastDay[] {
    const groups = new Map<string, WeatherForecastDay>();

    for (const item of hours) {
        const source = asRecord(item);
        const dateValue =
            source.date ??
            source.dateTime ??
            source.datetime ??
            source.dt_txt ??
            source.timestamp ??
            source.dt ??
            source.time;
        const parsedDate = toDate(dateValue);

        const key = parsedDate
            ? parsedDate.toISOString().slice(0, 10)
            : `group-${groups.size + 1}`;

        let group = groups.get(key);
        if (!group) {
            group = {
                day: parsedDate ? dayFormatter.format(parsedDate) : "Day",
                date: parsedDate ? dateFormatter.format(parsedDate) : "--",
                hours: [],
            };
            groups.set(key, group);
        }

        group.hours.push(mapHour(item));
    }

    return Array.from(groups.values())
        .slice(0, 5)
        .map((day) => ({
            ...day,
            hours: day.hours.slice(0, 8),
        }));
}

// Supports common wrapper formats like { data: ... } and { result: ... }.
function resolvePayload(rawResponse: unknown): Record<string, unknown> {
    const root = asRecord(rawResponse);

    const data = asRecord(root.data);
    if (Object.keys(data).length > 0) {
        return data;
    }

    const result = asRecord(root.result);
    if (Object.keys(result).length > 0) {
        return result;
    }

    return root;
}

function mapCurrent(payload: Record<string, unknown>, fallbackCity: string): WeatherCurrent {
    const nestedCurrent = asRecord(payload.current);
    const source =
        Object.keys(nestedCurrent).length > 0
            ? nestedCurrent
            : payload;

    const city = readString(source, ["city", "name"], fallbackCity);
    const country = readString(source, ["country", "countryCode"], "Unknown");
    const temperature = readNumber(source, ["temperature", "temp"], 0);
    const feelsLike = readNumber(
        source,
        ["feelsLike", "feels_like", "apparentTemperature"],
        temperature,
    );
    const weatherType = readWeatherType(source);
    const description = readDescription(source) || weatherType;

    return {
        city,
        country,
        temperature,
        description,
        feelsLike,
        weatherType,
        humidity: readNumber(source, ["humidity"], 0),
        windSpeed: readNumber(source, ["windSpeed", "wind_speed", "wind"], 0),
        pressure: readNumber(source, ["pressure"], 0),
        cloudiness: readNumber(source, ["cloudiness", "clouds"], 0),
    };
}

function mapForecast(payload: Record<string, unknown>): WeatherForecastDay[] {
    const forecastValue = payload.forecast;

    if (Array.isArray(forecastValue)) {
        const hasDailyFormat = forecastValue.some((item) => {
            const dayRecord = asRecord(item);
            return Array.isArray(dayRecord.hours) || Array.isArray(dayRecord.hourly);
        });

        if (hasDailyFormat) {
            return forecastValue.map(mapForecastDay).slice(0, 5);
        }

        return groupFlatForecast(forecastValue);
    }

    const forecastObject = asRecord(forecastValue);
    const days = forecastObject.days;
    if (Array.isArray(days)) {
        return days.map(mapForecastDay).slice(0, 5);
    }

    const hourly = payload.hourly;
    if (Array.isArray(hourly)) {
        return groupFlatForecast(hourly);
    }

    return [];
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
    const normalizedCity = city.trim();
    if (!normalizedCity) {
        throw new Error("Please enter a city name.");
    }

    // The backend contract may vary, so response is normalized below.
    const rawResponse = await apiRequest<unknown>({
        path: WEATHER_ENDPOINT,
        query: { city: normalizedCity },
    });

    const payload = resolvePayload(rawResponse);

    return {
        current: mapCurrent(payload, normalizedCity),
        forecast: mapForecast(payload),
    };
}
