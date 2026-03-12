import {useContext} from 'react';
import {I18nContext} from './I18nContext';

/**
 * Hook to access the translation function in components.
 * Falls back to returning the key if used outside a provider.
 *
 * @example
 * const { t } = useTranslate();
 * return <button aria-label={t('search.button.aria')}>Search</button>;
 *
 * @example with interpolation
 * const { t } = useTranslate();
 * return <span>{t('facet.aria', { label: 'Category' })}</span>;
 */
export default function useTranslate() {
    const context = useContext(I18nContext);
    return {
        t: context?.translate ?? ((key: string) => key)
    };
}
