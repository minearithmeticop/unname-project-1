# @monorepo/nextjs

Next.js application with server-side rendering, API routes, and App Router support.

## 📦 Purpose

A modern Next.js application that:
- Uses shared components from `@monorepo/core`
- Implements server-side rendering (SSR) and static site generation (SSG)
- Provides API routes for backend functionality
- Demonstrates App Router patterns (Next.js 14+)
- Optimizes performance with automatic code splitting

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 20.x or higher
- pnpm 8.x or higher (recommended)
- Built `@monorepo/core` package

### Initial Setup

```bash
# Navigate to nextjs package
cd packages/nextjs

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

---

## 📚 Tech Stack

| Technology | Version | Purpose | Documentation |
|-----------|---------|---------|---------------|
| **Next.js** | 14.2.x | React Framework | https://nextjs.org/docs |
| **React** | 18.3.1 | UI Library | https://react.dev/ |
| **TypeScript** | 5.6.x | Type Safety | https://www.typescriptlang.org/ |
| **@monorepo/core** | workspace:* | Shared Components | ../core/README.md |
| **ESLint** | 9.x | Linting | https://eslint.org/ |
| **Tailwind CSS** | 3.4.x | Styling (optional) | https://tailwindcss.com/ |

---

## 🛠 Commands

### Development

```bash
# Start dev server with HMR
pnpm dev

# Start on specific port
pnpm dev -p 4000

# Start with turbo mode (faster)
pnpm dev --turbo

# Run type check
pnpm type-check

# Lint code
pnpm lint

# Lint and fix
pnpm lint:fix
```

### Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Build and start
pnpm build && pnpm start

# Analyze bundle size
pnpm build --analyze
```

### Testing

```bash
# Run tests (if configured)
pnpm test

# Run E2E tests with Playwright
pnpm test:e2e
```

---

## 📁 Project Structure (App Router)

```
packages/nextjs/
├── public/             # Static assets
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/            # App Router (Next.js 14+)
│   │   ├── layout.tsx  # Root layout
│   │   ├── page.tsx    # Home page
│   │   ├── globals.css # Global styles
│   │   ├── api/        # API routes
│   │   │   └── hello/
│   │   │       └── route.ts
│   │   └── [dynamic]/ # Dynamic routes
│   │       └── page.tsx
│   ├── components/     # React components
│   │   ├── ClientComponent.tsx
│   │   └── ServerComponent.tsx
│   ├── lib/            # Utilities and helpers
│   │   ├── utils.ts
│   │   └── api.ts
│   └── types/          # TypeScript types
│       └── index.ts
├── next.config.mjs     # Next.js configuration
├── tsconfig.json       # TypeScript config
├── tailwind.config.ts  # Tailwind config (optional)
├── postcss.config.mjs  # PostCSS config (optional)
├── package.json
└── README.md
```

---

## 🔧 Configuration Files

### `package.json`

```json
{
  "name": "@monorepo/nextjs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "^14.2.15",
    "@monorepo/core": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5.6.2",
    "eslint": "^9",
    "eslint-config-next": "^14.2.15"
  }
}
```

### `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@monorepo/core'],
  
  // Optional: Configure image domains
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Optional: Enable experimental features
  experimental: {
    // serverActions: true,
  },
  
  // Optional: Configure redirects
  async redirects() {
    return [];
  },
  
  // Optional: Configure headers
  async headers() {
    return [];
  },
};

export default nextConfig;
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["../core/src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 📖 Using Shared Components

### Client Components

```typescript
// src/app/page.tsx
'use client'; // Mark as client component

import { Button, useCounter } from '@monorepo/core';

export default function Home() {
  const { count, increment } = useCounter(0);
  
  return (
    <main>
      <h1>Counter: {count}</h1>
      <Button onClick={increment}>Increment</Button>
    </main>
  );
}
```

### Server Components

```typescript
// src/app/products/page.tsx
import { Card } from '@monorepo/core'; // Only use if it doesn't have hooks

async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      {products.map(product => (
        <Card key={product.id}>
          <h2>{product.name}</h2>
        </Card>
      ))}
    </div>
  );
}
```

### API Routes

```typescript
// src/app/api/hello/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello from API' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

---

## 🎨 Styling Options

### Tailwind CSS (Recommended)

```bash
# Install Tailwind
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

### CSS Modules

```typescript
// Component.module.css
import styles from './Component.module.css';

export default function Component() {
  return <div className={styles.container}>Content</div>;
}
```

### Global CSS

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or connect GitHub repository at https://vercel.com
```

**Automatic Deployment:**
1. Push to GitHub
2. Import repository in Vercel
3. Configure build settings (auto-detected)
4. Deploy automatically on push

### Other Platforms

#### **Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build command: pnpm build
# Publish directory: .next

netlify deploy --prod
```

#### **Docker**
```dockerfile
# Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

#### **Self-Hosted**
```bash
# Build
pnpm build

# Start server
pnpm start

# Or use PM2 for production
npm install -g pm2
pm2 start npm --name "nextjs-app" -- start
```

---

## 🔄 Environment Variables

Create `.env.local` for local development:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://user:password@localhost:5432/db
SECRET_KEY=your-secret-key
```

**Important:**
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Other variables are only available on the server

Usage:

```typescript
// Client-side
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Server-side only
const dbUrl = process.env.DATABASE_URL;
```

---

## 📊 Data Fetching Patterns

### Server Component (Recommended)

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store', // or 'force-cache', or { next: { revalidate: 3600 } }
  });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  return <div>{/* render posts */}</div>;
}
```

### Client Component with SWR

```bash
pnpm add swr
```

```typescript
'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return <div>Hello {data.name}!</div>;
}
```

### Server Actions

```typescript
// app/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  // Process data...
  return { success: true };
}

// app/page.tsx
import { createPost } from './actions';

export default function Page() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 🧪 Testing

### Unit Testing with Jest

```bash
pnpm add -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### E2E Testing with Playwright

```bash
pnpm create playwright
pnpm test:e2e
```

---

## 🔄 Version Management

```bash
# Check outdated packages
pnpm outdated

# Update Next.js
pnpm update next@latest react@latest react-dom@latest

# Update all dependencies
pnpm update --latest
```

---

## 🐛 Troubleshooting

### Core Package Not Found

```bash
# Build core package first
cd ../core
pnpm build
cd ../nextjs
pnpm install
```

### Clear Next.js Cache

```bash
rm -rf .next
pnpm dev
```

### Port Already in Use

```bash
pnpm dev -p 4000
```

### Build Errors

```bash
# Clean install
rm -rf node_modules .next
pnpm install
pnpm build
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [React Server Components](https://react.dev/reference/react/use-server)
- [Vercel Deployment](https://vercel.com/docs)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
