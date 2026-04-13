import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const isBrowser = typeof window !== 'undefined';

const isAppearance = (value: string | null): value is Appearance => value === 'light' || value === 'dark' || value === 'system';

const getSavedAppearance = (): Appearance => {
    if (!isBrowser) {
        return 'system';
    }

    const saved = localStorage.getItem('appearance');

    return isAppearance(saved) ? saved : 'system';
};

const prefersDark = () => (isBrowser ? window.matchMedia('(prefers-color-scheme: dark)').matches : false);

const applyTheme = (appearance: Appearance) => {
    if (!isBrowser) {
        return;
    }

    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

export function initializeTheme() {
    applyTheme(getSavedAppearance());
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>(getSavedAppearance);

    const updateAppearance = (mode: Appearance) => {
        setAppearance(mode);

        if (isBrowser) {
            localStorage.setItem('appearance', mode);
        }

        applyTheme(mode);
    };

    useEffect(() => {
        if (!isBrowser) {
            return;
        }

        applyTheme(appearance);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = () => {
            if (getSavedAppearance() === 'system') {
                applyTheme('system');
            }
        };

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key !== 'appearance') {
                return;
            }

            const nextAppearance = getSavedAppearance();
            setAppearance(nextAppearance);
            applyTheme(nextAppearance);
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [appearance]);

    return { appearance, updateAppearance };
}
