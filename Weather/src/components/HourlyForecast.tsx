import {
    Cloud,
    CloudRain,
    CloudSnow,
    Sun,
    CloudDrizzle,
    CloudLightning,
    CloudFog,
    Sunrise,
    Sunset
} from "lucide-react";
import { motion } from "motion/react";

interface HourlyData {
    time: string;
    weatherType: string;
    temperature: number;
}

interface HourlyForecastProps {
    day: string;
    date: string;
    hours: HourlyData[];
}

export function HourlyForecast({ day, date, hours }: HourlyForecastProps) {
    const getWeatherIcon = (type: string, time: string) => {
        const iconProps = { className: "w-8 h-8", strokeWidth: 1.5 };
        const hour = parseInt(time.split(':')[0]);

        // Специальные иконки для восхода и заката
        if (type === "clear" && hour === 6) {
            return <Sunrise {...iconProps} className="w-8 h-8 text-orange-400 dark:text-orange-300" />;
        }
        if (type === "clear" && hour === 18) {
            return <Sunset {...iconProps} className="w-8 h-8 text-orange-500 dark:text-orange-400" />;
        }

        switch (type.toLowerCase()) {
            case "clear":
                return <Sun {...iconProps} className="w-8 h-8 text-yellow-500 dark:text-yellow-300" />;
            case "rain":
                return <CloudRain {...iconProps} className="w-8 h-8 text-blue-500 dark:text-blue-300" />;
            case "snow":
                return <CloudSnow {...iconProps} className="w-8 h-8 text-blue-300 dark:text-blue-100" />;
            case "drizzle":
                return <CloudDrizzle {...iconProps} className="w-8 h-8 text-blue-400 dark:text-blue-200" />;
            case "thunderstorm":
                return <CloudLightning {...iconProps} className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />;
            case "fog":
            case "mist":
                return <CloudFog {...iconProps} className="w-8 h-8 text-gray-400 dark:text-gray-300" />;
            default:
                return <Cloud {...iconProps} className="w-8 h-8 text-gray-500 dark:text-gray-200" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/30 dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-white/10 hover:bg-black/40 dark:hover:bg-white/15 transition-colors shadow-[0_8px_32px_0_rgba(59,130,246,0.3)] dark:shadow-[0_8px_32px_0_rgba(59,130,246,0.2)]"
        >
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {day}
                </h3>
                <p className="text-gray-600 dark:text-white/60 text-sm">{date}</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {hours.map((hour, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col items-center text-center gap-2"
                    >
            <span className="text-sm font-medium text-gray-700 dark:text-white/80">
              {hour.time}
            </span>

                        <div className="my-1">
                            {getWeatherIcon(hour.weatherType, hour.time)}
                        </div>

                        <span className="text-lg font-semibold text-gray-800 dark:text-white">
              {Math.round(hour.temperature)}°
            </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
