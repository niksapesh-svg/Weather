import {
    Cloud,
    CloudRain,
    CloudSnow,
    Sun,
    CloudDrizzle,
    CloudLightning,
    CloudFog
} from "lucide-react";
import { motion } from "motion/react";

interface CurrentWeatherProps {
    city: string;
    country: string;
    temperature: number;
    description: string;
    feelsLike: number;
    weatherType: string;
}

export function CurrentWeather({
                                   city,
                                   country,
                                   temperature,
                                   description,
                                   feelsLike,
                                   weatherType,
                               }: CurrentWeatherProps) {
    const getWeatherIcon = (type: string) => {
        const iconProps = { className: "w-32 h-32 text-white drop-shadow-lg", strokeWidth: 1.5 };

        switch (type.toLowerCase()) {
            case "clear":
                return <Sun {...iconProps} />;
            case "rain":
                return <CloudRain {...iconProps} />;
            case "snow":
                return <CloudSnow {...iconProps} />;
            case "drizzle":
                return <CloudDrizzle {...iconProps} />;
            case "thunderstorm":
                return <CloudLightning {...iconProps} />;
            case "fog":
            case "mist":
                return <CloudFog {...iconProps} />;
            default:
                return <Cloud {...iconProps} />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 dark:border-white/10 mb-8 shadow-xl dark:shadow-cyan-500/10"
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Иконка и температура */}
                <div className="flex items-center gap-6">
                    <motion.div
                        className="flex-shrink-0"
                        animate={{
                            rotate: weatherType === "clear" ? [0, 360] : 0,
                        }}
                        transition={{
                            duration: 20,
                            repeat: weatherType === "clear" ? Infinity : 0,
                            ease: "linear",
                        }}
                    >
                        {getWeatherIcon(weatherType)}
                    </motion.div>
                    <div>
                        <div className="text-7xl md:text-8xl font-light text-gray-800 dark:text-white">
                            {Math.round(temperature)}°
                        </div>
                        <div className="text-xl text-gray-600 dark:text-white/80 mt-2">
                            Ощущается как {Math.round(feelsLike)}°
                        </div>
                    </div>
                </div>

                {/* Информация о городе и описание */}
                <div className="text-center md:text-right">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
                        {city}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-white/70 mb-4">{country}</p>
                    <p className="text-2xl text-gray-700 dark:text-white/90 capitalize">{description}</p>
                </div>
            </div>
        </motion.div>
    );
}