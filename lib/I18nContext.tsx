import {Context, createContext, ReactNode, useCallback, useMemo} from 'react';

/**
 * Translation function type - compatible with most i18n libraries
 * @param key - The translation key
 * @param options - Optional interpolation values (e.g., {count: 5, label: 'Items'})
 */
export type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

/**
 * Type for translation keys - use `keyof typeof yourTranslations` in consuming packages
 * for autocomplete support.
 */
export type TranslationKey = string;

interface I18nContextValue {
    translate: TranslateFn;
    locale: Intl.Locale;
}

interface I18nProviderProps {
    /**
     * Custom translate function from your i18n library (react-intl, i18next, etc.)
     * If provided, this takes precedence over the translations prop.
     */
    translate?: TranslateFn;
    /**
     * Default translations for this package/domain. These are the baseline strings.
     */
    defaultTranslations?: Record<string, string>;
    /**
     * Partial translations to override specific keys in defaultTranslations.
     */
    translations?: Partial<Record<string, string>>;
    locale?: string | Intl.Locale;
    children: ReactNode;
}

export const I18nContext: Context<I18nContextValue | undefined> =
    createContext<I18nContextValue | undefined>(undefined);

/**
 * Simple interpolation function for {{key}} placeholders
 */
function interpolate(template: string, values?: Record<string, unknown>): string {
    if (!values) return template;
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        const value = values[key];
        return value !== undefined ? String(value) : `{{${key}}}`;
    });
}

/**
 * Creates a translate function that uses the given translations map.
 * Falls back to returning the key if no translation is found.
 */
export function createTranslateFn(translations: Record<string, string>): TranslateFn {
    return (key: string, options?: Record<string, unknown>) => {
        const template = translations[key] ?? key;
        return interpolate(template, options);
    };
}

export function I18nProvider({translate, defaultTranslations = {}, translations, locale = 'en', children}: I18nProviderProps) {
    const localeObj = useMemo(
        () => locale instanceof Intl.Locale ? locale : new Intl.Locale(locale),
        [locale]
    );

    const translateFn = useCallback(
        (key: string, options?: Record<string, unknown>) => {
            if (translate) {
                return translate(key, options);
            }
            const mergedTranslations: Record<string, string> = {
                ...defaultTranslations,
                ...Object.fromEntries(
                    Object.entries(translations ?? {}).filter((entry): entry is [string, string] => entry[1] !== undefined)
                )
            };
            return createTranslateFn(mergedTranslations)(key, options);
        },
        [translate, defaultTranslations, translations]
    );

    return (
        <I18nContext.Provider value={{translate: translateFn, locale: localeObj}}>
            {children}
        </I18nContext.Provider>
    );
}
