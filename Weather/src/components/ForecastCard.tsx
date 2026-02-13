import {
    Cloud,
    CloudRain,
    CloudSnow,
    Sun,
    CloudDrizzle,
    CloudLightning,
    CloudFog
} from "lucide-react";

interface ForecastCardProps {
    day: string;
    date: string;
    weatherType: string;
    tempMax: number;
    tempMin: number;
    description: string;
}

export function ForecastCard({
                                 day,
                                 date,
                                 weatherType,
                                 tempMax,
                                 tempMin,
                                 description,
                             }: ForecastCardProps) {
    const getWeatherIcon = (type: string) => {
        const iconProps = { className: "w-16 h-16 text-white", strokeWidth: 1.5 };

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
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
            <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-semibold text-white mb-1">{day}</h3>
                <p className="text-white/60 text-sm mb-4">{date}</p>

                <div className="mb-4">
                    {getWeatherIcon(weatherType)}
                </div>

                <p className="text-white/80 capitalize mb-4 text-sm">{description}</p>

                <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold text-white">
            {Math.round(tempMax)}°
          </span>
                    <span className="text-xl text-white/50">
            {Math.round(tempMin)}°
          </span>
                </div>
            </div>
        </div>
    );
}
