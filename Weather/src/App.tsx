import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { SearchBar } from "./components/SearchBar";
import { CurrentWeather } from "./components/CurrentWeather";
import { WeatherDetails } from "./components/WeatherDetails";
import { HourlyForecast } from "./components/HourlyForecast";
import { Footer } from "./components/Footer";
import { ThemeToggle } from "./components/ThemeToggle";
import { WeatherAnimations } from "./components/WeatherAnimations";
import { ThemeProvider } from "./components/ThemeProvider";
import { fetchWeatherByCity } from "./api/weatherApi";
import type { WeatherData } from "./api/types";

function AppContent() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Centralized request flow for initial load and manual search
    const loadWeather = useCallback(async (city: string) => {
        const normalizedCity = city.trim();
        if (!normalizedCity) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const data = await fetchWeatherByCity(normalizedCity);
            setWeatherData(data);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to load weather data.";
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSearch = (city: string) => {
        void loadWeather(city);
    };

    const weatherType = weatherData?.current.weatherType ?? "";

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500 relative">
            <WeatherAnimations weatherType={weatherType} />

            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center md:text-left"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-2">
                                Weather Forecast
                            </h1>
                            <p className="text-gray-700 dark:text-white/80 text-lg">
                                Live weather updates for your city
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ThemeToggle />
                        </motion.div>
                    </div>

                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />

                    {/* Keep previous data visible while a refresh is in progress. */}
                    {isLoading && weatherData ? (
                        <p className="text-center text-sm text-gray-700 dark:text-white/80 mb-4">
                            Updating weather...
                        </p>
                    ) : null}

                    {errorMessage ? (
                        // Surface backend/network errors to the user.
                        <div className="mb-6 rounded-2xl border border-red-300 bg-red-100/80 px-4 py-3 text-red-800 dark:border-red-500/50 dark:bg-red-500/10 dark:text-red-200">
                            {errorMessage}
                        </div>
                    ) : null}

                    {weatherData ? (
                        <>
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

                            <div className="mb-8">
                                <motion.h2
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl font-bold text-gray-800 dark:text-white mb-6"
                                >
                                    5-Day Forecast
                                </motion.h2>

                                {weatherData.forecast.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                        {weatherData.forecast.map((day, index) => (
                                            <HourlyForecast
                                                key={`${day.day}-${day.date}-${index}`}
                                                day={day.day}
                                                date={day.date}
                                                hours={day.hours}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-sky-200/70 bg-sky-100/80 px-4 py-3 text-gray-700 dark:border-sky-300/30 dark:bg-sky-500/20 dark:text-white/80">
                                        Forecast is not available for this city.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="mb-8 rounded-2xl border border-sky-200/70 bg-sky-100/80 px-4 py-6 text-center text-gray-700 dark:border-sky-300/30 dark:bg-sky-500/20 dark:text-white/80">
                            {isLoading ? "Loading weather..." : "Введите город"}
                        </div>
                    )}

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

export default App;
