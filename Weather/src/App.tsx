import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { CurrentWeather } from "./components/CurrentWeather";
import { WeatherDetails } from "./components/WeatherDetails";
import { HourlyForecast } from "./components/HourlyForecast";
import { Footer } from "./components/Footer";
import { ThemeToggle } from "./components/ThemeToggle";
import { WeatherAnimations } from "./components/WeatherAnimations";
import { ThemeProvider } from "./components/ThemeProvider";
import { motion } from "motion/react"; //for animations

interface WeatherData {
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

interface HourlyData {
    time: string;
    weatherType: string;
    temperature: number;
}

interface ForecastDay {
    day: string;
    date: string;
    hours: HourlyData[];
}

// Мок-данные длдемонстрации
const mockWeatherData: Record<string, { current: WeatherData; forecast: ForecastDay[] }> = {
    "москва": {
        current: {
            city: "Москва",
            country: "Россия",
            temperature: -2,
            description: "облачно с прояснениями",
            feelsLike: -6,
            weatherType: "cloud",
            humidity: 75,
            windSpeed: 4.5,
            pressure: 1013,
            cloudiness: 60,
        },
        forecast: [
            {
                day: "Вторник",
                date: "10 фев",
                hours: [
                    { time: "6:00", weatherType: "snow", temperature: -5 },
                    { time: "12:00", weatherType: "snow", temperature: -2 },
                    { time: "18:00", weatherType: "cloud", temperature: -3 },
                    { time: "00:00", weatherType: "cloud", temperature: -6 },
                ],
            },
            {
                day: "Среда",
                date: "11 фев",
                hours: [
                    { time: "6:00", weatherType: "cloud", temperature: -3 },
                    { time: "12:00", weatherType: "cloud", temperature: 1 },
                    { time: "18:00", weatherType: "cloud", temperature: 0 },
                    { time: "00:00", weatherType: "cloud", temperature: -2 },
                ],
            },
            {
                day: "Четверг",
                date: "12 фев",
                hours: [
                    { time: "6:00", weatherType: "clear", temperature: -1 },
                    { time: "12:00", weatherType: "clear", temperature: 3 },
                    { time: "18:00", weatherType: "clear", temperature: 2 },
                    { time: "00:00", weatherType: "clear", temperature: -1 },
                ],
            },
            {
                day: "Пятница",
                date: "13 фев",
                hours: [
                    { time: "6:00", weatherType: "cloud", temperature: 2 },
                    { time: "12:00", weatherType: "rain", temperature: 5 },
                    { time: "18:00", weatherType: "rain", temperature: 4 },
                    { time: "00:00", weatherType: "rain", temperature: 3 },
                ],
            },
            {
                day: "Суббота",
                date: "14 фев",
                hours: [
                    { time: "6:00", weatherType: "cloud", temperature: 0 },
                    { time: "12:00", weatherType: "cloud", temperature: 4 },
                    { time: "18:00", weatherType: "cloud", temperature: 3 },
                    { time: "00:00", weatherType: "cloud", temperature: 1 },
                ],
            },
        ],
    },
    "лондон": {
        current: {
            city: "Лондон",
            country: "Великобритания",
            temperature: 12,
            description: "дождь",
            feelsLike: 10,
            weatherType: "rain",
            humidity: 85,
            windSpeed: 6.2,
            pressure: 1008,
            cloudiness: 90,
        },
        forecast: [
            {
                day: "Вторник",
                date: "10 фев",
                hours: [
                    { time: "6:00", weatherType: "rain", temperature: 9 },
                    { time: "12:00", weatherType: "rain", temperature: 13 },
                    { time: "18:00", weatherType: "rain", temperature: 12 },
                    { time: "00:00", weatherType: "rain", temperature: 10 },
                ],
            },
            {
                day: "Среда",
                date: "11 фев",
                hours: [
                    { time: "6:00", weatherType: "drizzle", temperature: 10 },
                    { time: "12:00", weatherType: "drizzle", temperature: 14 },
                    { time: "18:00", weatherType: "cloud", temperature: 13 },
                    { time: "00:00", weatherType: "cloud", temperature: 11 },
                ],
            },
            {
                day: "Четверг",
                date: "12 фев",
                hours: [
                    { time: "6:00", weatherType: "cloud", temperature: 11 },
                    { time: "12:00", weatherType: "cloud", temperature: 15 },
                    { time: "18:00", weatherType: "cloud", temperature: 14 },
                    { time: "00:00", weatherType: "cloud", temperature: 12 },
                ],
            },
            {
                day: "Пятница",
                date: "13 фев",
                hours: [
                    { time: "6:00", weatherType: "rain", temperature: 9 },
                    { time: "12:00", weatherType: "rain", temperature: 13 },
                    { time: "18:00", weatherType: "rain", temperature: 11 },
                    { time: "00:00", weatherType: "rain", temperature: 10 },
                ],
            },
            {
                day: "Суббота",
                date: "14 фев",
                hours: [
                    { time: "6:00", weatherType: "cloud", temperature: 10 },
                    { time: "12:00", weatherType: "cloud", temperature: 14 },
                    { time: "18:00", weatherType: "cloud", temperature: 13 },
                    { time: "00:00", weatherType: "cloud", temperature: 11 },
                ],
            },
        ],
    },
    "токио": {
        current: {
            city: "Токио",
            country: "Япония",
            temperature: 18,
            description: "ясно",
            feelsLike: 17,
            weatherType: "clear",
            humidity: 45,
            windSpeed: 3.1,
            pressure: 1020,
            cloudiness: 10,
        },
        forecast: [
            {
                day: "Вторник",
                date: "10 фев",
                hours: [
                    { time: "6:00", weatherType: "clear", temperature: 12 },
                    { time: "12:00", weatherType: "clear", temperature: 19 },
                    { time: "18:00", weatherType: "clear", temperature: 16 },
                    { time: "00:00", weatherType: "clear", temperature: 13 },
                ],
            },
            {
                day: "Среда",
                date: "11 фев",
                hours: [
                    { time: "6:00", weatherType: "clear", temperature: 13 },
                    { time: "12:00", weatherType: "clear", temperature: 20 },
                    { time: "18:00", weatherType: "clear", temperature: 17 },
                    { time: "00:00", weatherType: "clear", temperature: 14 },
                ],
            },
            {
                day: "Четверг",
                date: "12 фев",
                hours: [
                    { time: "6:00", weatherType: "cloud", temperature: 12 },
                    { time: "12:00", weatherType: "cloud", temperature: 18 },
                    { time: "18:00", weatherType: "cloud", temperature: 16 },
                    { time: "00:00", weatherType: "cloud", temperature: 13 },
                ],
            },
            {
                day: "Пятница",
                date: "13 фев",
                hours: [
                    { time: "6:00", weatherType: "drizzle", temperature: 11 },
                    { time: "12:00", weatherType: "drizzle", temperature: 16 },
                    { time: "18:00", weatherType: "cloud", temperature: 14 },
                    { time: "00:00", weatherType: "cloud", temperature: 12 },
                ],
            },
            {
                day: "Суббота",
                date: "14 фев",
                hours: [
                    { time: "6:00", weatherType: "clear", temperature: 13 },
                    { time: "12:00", weatherType: "clear", temperature: 19 },
                    { time: "18:00", weatherType: "clear", temperature: 17 },
                    { time: "00:00", weatherType: "clear", temperature: 14 },
                ],
            },
        ],
    },
};

function AppContent() {
    const [currentCity, setCurrentCity] = useState("москва");
    const weatherData = mockWeatherData[currentCity.toLowerCase()] || mockWeatherData["москва"];

    const handleSearch = (city: string) => {
        const cityLower = city.toLowerCase();
        if (mockWeatherData[cityLower]) {
            setCurrentCity(cityLower);
        } else {
            alert(`Ничего не найдено.`);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500 relative">
            <WeatherAnimations weatherType={weatherData.current.weatherType} />

            {/* Main content */}
            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header and Topic Switcher */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center md:text-left"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-2">
                                Прогноз погоды
                            </h1>
                            <p className="text-gray-700 dark:text-white/80 text-lg">
                                Актуальная информация о погоде в вашем городе
                            </p>
                        </motion.div>

                        {/*Theme Switch Button Animation*/}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ThemeToggle />
                        </motion.div>
                    </div>

                    {/* Search */}
                    <SearchBar onSearch={handleSearch} />


                    <CurrentWeather
                        city={weatherData.current.city}
                        country={weatherData.current.country}
                        temperature={weatherData.current.temperature}
                        description={weatherData.current.description}
                        feelsLike={weatherData.current.feelsLike}
                        weatherType={weatherData.current.weatherType}
                    />


                    <WeatherDetails
                        humidity={weatherData.current.humidity}
                        windSpeed={weatherData.current.windSpeed}
                        pressure={weatherData.current.pressure}
                        cloudiness={weatherData.current.cloudiness}
                    />

                    {/* 5-day forecast with time intervals */}
                    <div className="mb-8">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
                        >
                            Прогноз на 5 дней
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {weatherData.forecast.map((day, index) => (
                                <HourlyForecast
                                    key={index}
                                    day={day.day}
                                    date={day.date}
                                    hours={day.hours}
                                />
                            ))}
                        </div>
                    </div>


                    <Footer />
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

export default App; // Этот компонент — главный экспорт файла.Благодаря этому можно в другом файле написать:import App from "./App";
