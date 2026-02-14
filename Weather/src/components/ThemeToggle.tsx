import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const themes = [
        { value: "light", icon: Sun, label: "Светлая" },
        { value: "dark", icon: Moon, label: "Тёмная" },
        { value: "system", icon: Monitor, label: "Системная" },
    ];

    return (
        <div className="flex items-center gap-2 bg-black/30 dark:bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(59,130,246,0.3)] dark:shadow-[0_8px_32px_0_rgba(59,130,246,0.2)]">
            {themes.map(({ value, icon: Icon, label }) => (
                <motion.button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`relative px-4 py-2 rounded-xl transition-all ${
                        theme === value
                            ? "text-white"
                            : "text-white/60 hover:text-white/80"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {theme === value && (
                        <motion.div
                            layoutId="activeTheme"
                            className="absolute inset-0 bg-white/20 dark:bg-cyan-500/20 rounded-xl border border-white/30 dark:border-cyan-400/30"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">{label}</span>
          </span>
                </motion.button>
            ))}
        </div>
    );
}
