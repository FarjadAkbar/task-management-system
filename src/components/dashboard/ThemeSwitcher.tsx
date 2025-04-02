"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-all hover:bg-gray-300 dark:hover:bg-gray-700"
        >
            {theme === "light" ? (
                <Moon className="h-6 w-6 text-gray-900 dark:text-yellow-400" />
            ) : (
                <Sun className="h-6 w-6 text-yellow-500 dark:text-gray-100" />
            )}
        </button>
    );
}