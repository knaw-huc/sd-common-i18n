# @knaw-huc/common-i18n

A lightweight React internationalization (i18n) library for sharing translation capabilities across (KNAW HUC) packages. It works with your existing i18n solution (react-intl, i18next, etc.) or standalone with its own built-in translation management.

## Installation

```bash
npm install @knaw-huc/common-i18n
```

React 19 is a peer dependency.

## Quick Start

Wrap your app with `I18nProvider` and use the `useTranslate` hook in components:

```tsx
import { I18nProvider, useTranslate } from '@knaw-huc/common-i18n';

const translations = {
  'greeting': 'Hello, {{name}}!',
  'search.button': 'Search',
};

function App() {
  return (
    <I18nProvider defaultTranslations={translations} locale="en">
      <MyComponent />
    </I18nProvider>
  );
}

function MyComponent() {
  const { t } = useTranslate();
  return <button>{t('search.button')}</button>; // → "Search"
}
```

## API

### `I18nProvider`

The context provider that supplies translation and locale to the component tree.

```tsx
<I18nProvider
  defaultTranslations={{ 'key': 'Default text' }}
  translations={{ 'key': 'Override text' }}
  locale="en-US"
>
  {children}
</I18nProvider>
```

| Prop | Type | Description |
|---|---|---|
| `defaultTranslations` | `Record<string, string>` | Baseline translation strings |
| `translations` | `Partial<Record<string, string>>` | Partial overrides applied on top of `defaultTranslations` |
| `translate` | `TranslateFn` | Custom translate function — takes precedence over all translations |
| `locale` | `string \| Intl.Locale` | Locale identifier, defaults to `'en'` |
| `children` | `ReactNode` | Component children |

**Translation priority (highest to lowest):**
1. Custom `translate` function
2. Merged `defaultTranslations` + `translations` overrides
3. Fallback to the key itself

### `useTranslate`

Returns a `t` function for translating keys.

```tsx
const { t } = useTranslate();

t('greeting')                       // → "Hello, {{name}}!"
t('greeting', { name: 'Alice' })    // → "Hello, Alice!"
t('unknown.key')                    // → "unknown.key" (fallback)
```

Supports `{{key}}` placeholder interpolation. If used outside a provider, keys are returned as-is.

### `useLocale`

Returns the current locale as an `Intl.Locale` object.

```tsx
const locale = useLocale();
locale.language  // → "en"
locale.region    // → "US"
```

Defaults to `'en'` if used outside a provider.

### `createTranslateFn`

Creates a `TranslateFn` from a translations map. Useful for constructing translate functions manually.

```tsx
import { createTranslateFn } from '@knaw-huc/common-i18n';

const t = createTranslateFn({ 'hello': 'Hello, {{name}}!' });
t('hello', { name: 'World' }); // → "Hello, World!"
t('missing');                  // → "missing"
```

## Using with an External i18n Library

Pass a custom `translate` function to delegate to your preferred library:

```tsx
import { useIntl } from 'react-intl';

function I18nBridge({ children }) {
  const intl = useIntl();
  return (
    <I18nProvider translate={(key, options) => intl.formatMessage({ id: key }, options)}>
      {children}
    </I18nProvider>
  );
}
```

## Types

```typescript
type TranslateFn = (key: string, options?: Record<string, unknown>) => string;
type TranslationKey = string;
```

## Development

```bash
npm run build          # Build the library
npm run prepublishOnly # Build before publishing (runs automatically)
```

Output is an ES module bundle in `dist/`. TypeScript declarations are generated for all exports.
