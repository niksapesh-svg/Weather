export function Footer() {
    return (
        <footer className="mt-12 py-8 border-t border-white/10 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-gray-700 dark:text-white/70 text-sm">
                        Weather data provided by <span className="font-semibold">OpenWeather</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
                        <a
                            href="#privacy"
                            className="text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#terms"
                            className="text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Terms of Service
                        </a>
                        <a
                            href="#contact"
                            className="text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Contact
                        </a>
                        <a
                            href="#status"
                            className="text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Status
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}