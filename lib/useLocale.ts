import {useContext} from 'react';
import {I18nContext} from './I18nContext';

export default function useLocale() {
    const context = useContext(I18nContext);
    return context?.locale ?? new Intl.Locale('en');
}
