import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface WeatherAnimationsProps {
    weatherType: string;
}

export function WeatherAnimations({ weatherType }: WeatherAnimationsProps) {
    const [particles, setParticles] = useState<number[]>([]);
    const [viewport, setViewport] = useState({ width: 0, height: 0 });
    const normalizedWeatherType = weatherType.toLowerCase();

    useEffect(() => {
        const updateViewport = () => {
            setViewport({ width: window.innerWidth, height: window.innerHeight });
        };

        updateViewport();
        window.addEventListener("resize", updateViewport);

        return () => {
            window.removeEventListener("resize", updateViewport);
        };
    }, []);

    useEffect(() => {
        if (
            normalizedWeatherType === "rain" ||
            normalizedWeatherType === "snow" ||
            normalizedWeatherType === "drizzle"
        ) {
            setParticles(Array.from({ length: 50 }, (_, i) => i));
            return;
        }

        setParticles([]);
    }, [normalizedWeatherType]);

    if (normalizedWeatherType === "clear") {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div
                    className="absolute top-20 right-20 w-96 h-96 rounded-full bg-yellow-300/30 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <motion.div
                    className="absolute top-32 right-32 w-64 h-64 rounded-full bg-yellow-200/40 blur-2xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>
        );
    }

    if (normalizedWeatherType === "rain" || normalizedWeatherType === "drizzle") {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute inset-0 backdrop-blur-[2px] bg-blue-900/10" />

                {particles.map((i) => (
                    <motion.div
                        key={i}
                        className="absolute w-0.5 h-8 bg-gradient-to-b from-blue-200/60 to-transparent rounded-full"
                        initial={{
                            x: Math.random() * viewport.width,
                            y: -20,
                            opacity: Math.random() * 0.5 + 0.3,
                        }}
                        animate={{
                            y: viewport.height + 20,
                        }}
                        transition={{
                            duration: normalizedWeatherType === "drizzle" ? 2 : 1,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "linear",
                        }}
                        style={{
                            left: `${(i * 13) % 100}%`,
                        }}
                    />
                ))}
            </div>
        );
    }

    if (normalizedWeatherType === "snow") {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {particles.map((i) => {
                    const size = Math.random() * 6 + 2;
                    const delay = Math.random() * 5;
                    const duration = Math.random() * 5 + 5;
                    const xOffset = Math.random() * 100 - 50;

                    return (
                        <motion.div
                            key={i}
                            className="absolute bg-white rounded-full shadow-lg"
                            style={{
                                width: size,
                                height: size,
                                left: `${(i * 7) % 100}%`,
                            }}
                            initial={{
                                y: -20,
                                x: 0,
                                opacity: Math.random() * 0.6 + 0.4,
                            }}
                            animate={{
                                y: viewport.height + 20,
                                x: [0, xOffset, -xOffset, 0],
                            }}
                            transition={{
                                y: {
                                    duration,
                                    repeat: Infinity,
                                    delay,
                                    ease: "linear",
                                },
                                x: {
                                    duration: duration / 2,
                                    repeat: Infinity,
                                    delay,
                                    ease: "easeInOut",
                                },
                            }}
                        />
                    );
                })}
            </div>
        );
    }

    return null;
}
