# Internationalization (i18n) Implementation Guide

This document explains how internationalization is implemented in this Next.js 16 application and how to use it correctly.

## Overview

The application supports multiple languages (currently English and Spanish) using Next.js dynamic routes and a custom proxy for automatic locale detection and redirection.

## Architecture

### 1. Folder Structure

```
src/
├── app/
│   └── [lang]/              # Dynamic locale segment
│       ├── layout.tsx       # Root layout with locale parameter
│       ├── page.tsx         # Home page
│       ├── dictionaries/    # Translation files
│       │   ├── en.json
│       │   └── es.json
│       └── dictionaries.ts  # Dictionary loader
├── proxy.ts                 # Locale detection and redirection
├── hooks/
│   ├── use-locale.ts        # Hook to get current locale (client)
│   └── use-localized-paths.ts # Hook for localized paths (client)
└── lib/
    └── paths.ts             # Path utilities (server)
```

### 2. Proxy (Middleware)

The `src/proxy.ts` file handles automatic locale detection and redirection:

- **URL Access**: When accessing `/`, it redirects to `/en` (or user's preferred locale)
- **Locale Detection**: Uses Accept-Language header to determine user's language
- **Cookie Persistence**: Stores locale preference in `NEXT_LOCALE` cookie
- **Validation**: Ensures only supported locales are used

### 3. Supported Locales

Currently supported locales:
- `en` - English (default)
- `es` - Spanish (Español)

## Usage

### Adding New Locales

1. Add locale to proxy configuration (`src/proxy.ts`):
```typescript
const locales = ["en", "es", "fr"]; // Add new locale
```

2. Create dictionary file:
```bash
touch src/app/[lang]/dictionaries/fr.json
```

3. Update dictionaries loader (`src/app/[lang]/dictionaries.ts`):
```typescript
const dictionaries = {
    en: () => import("./dictionaries/en.json").then((module) => module.default),
    es: () => import("./dictionaries/es.json").then((module) => module.default),
    fr: () => import("./dictionaries/fr.json").then((module) => module.default),
};
```

4. Update `generateStaticParams` in root layout (`src/app/[lang]/layout.tsx`):
```typescript
export async function generateStaticParams() {
    return [{ lang: "en" }, { lang: "es" }, { lang: "fr" }];
}
```

5. Update type definitions in hooks:
```typescript
// src/hooks/use-locale.ts
export type Locale = "en" | "es" | "fr";
```

### Using Translations

#### In Server Components

```tsx
import { getDictionary } from "./dictionaries";

export default async function Page({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");
    
    return (
        <div>
            <h1>{dict.welcome.title}</h1>
            <p>{dict.welcome.description}</p>
        </div>
    );
}
```

#### In Client Components

```tsx
"use client";

import { useLocale } from "@/hooks/use-locale";
import { getDictionary } from "../dictionaries";
import { useEffect, useState } from "react";

export default function ClientComponent() {
    const locale = useLocale();
    const [dict, setDict] = useState<any>(null);

    useEffect(() => {
        getDictionary(locale).then(setDict);
    }, [locale]);

    if (!dict) return <div>Loading...</div>;

    return <div>{dict.welcome.title}</div>;
}
```

### Using Localized Paths

#### In Server Components

```tsx
import { getLocalizedPaths } from "@/lib/paths";

export default async function Page({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const PATHS = getLocalizedPaths(lang);
    
    return (
        <Link href={PATHS.AUTH.SIGN_IN}>
            Sign In
        </Link>
    );
}
```

#### In Client Components

```tsx
"use client";

import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { useRouter } from "next/navigation";

export default function ClientComponent() {
    const PATHS = useLocalizedPaths();
    const router = useRouter();
    
    const handleLogin = () => {
        router.push(PATHS.AUTH.SIGN_IN);
    };
    
    return <button onClick={handleLogin}>Sign In</button>;
}
```

### Redirects and Navigation

#### Programmatic Navigation (Client)

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";

export function MyComponent() {
    const router = useRouter();
    const PATHS = useLocalizedPaths();
    
    const navigateToDashboard = () => {
        router.push(PATHS.DASHBOARD.ROOT);
    };
    
    return <button onClick={navigateToDashboard}>Go to Dashboard</button>;
}
```

#### Programmatic Redirect (Server)

```tsx
import { redirect } from "next/navigation";
import { getLocalizedPaths } from "@/lib/paths";

export default async function Page({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const PATHS = getLocalizedPaths(lang);
    
    const isAuthenticated = false; // Your auth check
    
    if (!isAuthenticated) {
        redirect(PATHS.AUTH.SIGN_IN);
    }
    
    return <div>Protected content</div>;
}
```

## Dictionary Structure

Example dictionary file (`src/app/[lang]/dictionaries/en.json`):

```json
{
  "common": {
    "welcome": "Welcome",
    "loading": "Loading...",
    "error": "Something went wrong"
  },
  "auth": {
    "signIn": {
      "title": "Sign In",
      "email": "Email",
      "password": "Password",
      "submit": "Sign In"
    },
    "signUp": {
      "title": "Sign Up",
      "submit": "Create Account"
    }
  },
  "dashboard": {
    "title": "Dashboard",
    "profile": "Profile",
    "settings": "Settings"
  }
}
```

## Best Practices

1. **Always use locale parameter**: Never hardcode routes without the locale prefix
2. **Server vs Client**: Use `getLocalizedPaths()` for server components and `useLocalizedPaths()` for client components
3. **Cookie persistence**: The locale is stored in a cookie, so user preference persists across sessions
4. **Fallback**: Always provide a fallback to the default locale (English)
5. **Type safety**: Use TypeScript types for locales to prevent typos
6. **SEO**: Use `lang` attribute in the HTML tag (already configured in root layout)
7. **Static generation**: Use `generateStaticParams` to pre-render all locale versions

## Testing

### Test Locale Detection

```bash
# Default (English)
curl -I http://localhost:3000/

# Spanish
curl -I -H "Accept-Language: es-ES,es;q=0.9" http://localhost:3000/

# With cookie
curl -I -b "NEXT_LOCALE=es" http://localhost:3000/
```

### Test Redirects

1. Visit `http://localhost:3000/` - should redirect to `/en`
2. Visit `http://localhost:3000/dashboard` - should redirect to `/en/dashboard`
3. Change browser language to Spanish - should redirect to `/es`

## Troubleshooting

### Issue: Routes not redirecting

**Solution**: Make sure `src/proxy.ts` is in the correct location and properly exported.

### Issue: 404 on locale routes

**Solution**: Verify that all pages are inside `src/app/[lang]` directory.

### Issue: Client components not getting locale

**Solution**: Make sure you're using `useLocale()` hook and the component is marked with `"use client"`.

### Issue: Server actions not working with locale

**Solution**: Pass the locale as a parameter to your server actions:

```tsx
async function myAction(locale: string, formData: FormData) {
    "use server";
    const PATHS = getLocalizedPaths(locale);
    // Use PATHS...
}
```

## Migration from Non-i18n Routes

If you're migrating from routes without locales:

1. Move all pages from `src/app/` to `src/app/[lang]/`
2. Update all `redirect()` calls to use `getLocalizedPaths()`
3. Update all `router.push()` calls to use `useLocalizedPaths()`
4. Replace static `PATHS` imports with dynamic locale-aware paths
5. Add locale parameter to all page components
6. Test all navigation flows

## Resources

- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Next.js Proxy Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Accept-Language Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)