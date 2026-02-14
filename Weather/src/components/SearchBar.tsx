import { Search } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

interface SearchBarProps {
    onSearch: (city: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [searchValue, setSearchValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            onSearch(searchValue);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="w-full max-w-2xl mx-auto mb-8"
        >
            <div className="relative">
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Поиск города..."
                    className="w-full px-6 py-4 pr-14 text-lg rounded-2xl bg-black/30 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-[0_8px_32px_0_rgba(59,130,246,0.3)] dark:shadow-[0_8px_32px_0_rgba(59,130,246,0.2)] transition-shadow"
                />
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 transition-colors"
                >
                    <Search className="w-5 h-5 text-gray-700 dark:text-white" />
                </motion.button>
            </div>
        </motion.form>
    );
}