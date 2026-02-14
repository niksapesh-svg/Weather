import { Droplets, Wind, Gauge, Cloud } from "lucide-react";
import { motion } from "motion/react";

interface WeatherDetailsProps {
    humidity: number;
    windSpeed: number;
    pressure: number;
    cloudiness: number;
}

export function WeatherDetails({
                                   humidity,
                                   windSpeed,
                                   pressure,
                                   cloudiness,
                               }: WeatherDetailsProps) {
    const details = [
        {
            icon: Droplets,
            label: "Влажность",
            value: `${humidity}%`,
        },
        {
            icon: Wind,
            label: "Ветер",
            value: `${windSpeed} м/с`,
        },
        {
            icon: Gauge,
            label: "Давление",
            value: `${pressure} гПа`,
        },
        {
            icon: Cloud,
            label: "Облачность",
            value: `${cloudiness}%`,
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {details.map((detail, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-black/30 dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(59,130,246,0.3)] dark:shadow-[0_8px_32px_0_rgba(59,130,246,0.2)]"
                >
                    <div className="flex flex-col items-center text-center">
                        <detail.icon className="w-10 h-10 text-gray-700 dark:text-white/80 mb-3" strokeWidth={1.5} />
                        <p className="text-gray-600 dark:text-white/70 text-sm mb-2">{detail.label}</p>
                        <p className="text-gray-800 dark:text-white text-2xl font-semibold">{detail.value}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}