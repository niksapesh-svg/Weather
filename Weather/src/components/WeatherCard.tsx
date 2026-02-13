import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from 'lucide-react';

interface WeatherCardProps {
    temperature: number;
    condition: string;
    location: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    feelsLike: number;
}

export function WeatherCard({
                                temperature,
                                condition,
                                location,
                                humidity,
                                windSpeed,
                                visibility,
                                feelsLike,
                            }: WeatherCardProps) {
    const getWeatherIcon = () => {
        switch (condition.toLowerCase()) {
            case 'sunny':
            case 'clear':
                return <Sun className="w-24 h-24 text-yellow-400" />;
            case 'cloudy':
            case 'partly cloudy':
                return <Cloud className="w-24 h-24 text-gray-400" />;
            case 'rainy':
            case 'rain':
                return <CloudRain className="w-24 h-24 text-blue-400" />;
            default:
                return <Sun className="w-24 h-24 text-yellow-400" />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-4xl mb-2">{location}</h2>
                    <p className="text-blue-100">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-6xl mb-1">{Math.round(temperature)}°</div>
                    <p className="text-blue-100">Feels like {Math.round(feelsLike)}°</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8">
                {getWeatherIcon()}
                <div className="text-3xl">{condition}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex flex-col items-center">
                    <Droplets className="w-6 h-6 mb-2" />
                    <p className="text-sm text-blue-100">Humidity</p>
                    <p className="text-lg">{humidity}%</p>
                </div>
                <div className="flex flex-col items-center">
                    <Wind className="w-6 h-6 mb-2" />
                    <p className="text-sm text-blue-100">Wind</p>
                    <p className="text-lg">{windSpeed} mph</p>
                </div>
                <div className="flex flex-col items-center">
                    <Eye className="w-6 h-6 mb-2" />
                    <p className="text-sm text-blue-100">Visibility</p>
                    <p className="text-lg">{visibility} mi</p>
                </div>
            </div>
        </div>
    );
}
