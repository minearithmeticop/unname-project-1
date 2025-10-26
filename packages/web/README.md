# @monorepo/web

React web application built with Vite for fast development and optimized production builds.

## 📦 Purpose

A modern React web application that:
- Uses shared components from `@monorepo/core`
- Provides fast HMR (Hot Module Replacement) with Vite
- Demonstrates client-side rendering patterns
- Serves as a reference implementation for React best practices

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 20.x or higher
- pnpm 8.x or higher (recommended)
- Built `@monorepo/core` package

### Initial Setup

```bash
# Navigate to web package
cd packages/web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

---

## 📚 Tech Stack

| Technology | Version | Purpose | Documentation |
|-----------|---------|---------|---------------|
| **React** | 18.3.1 | UI Library | https://react.dev/ |
| **TypeScript** | 5.6.x | Type Safety | https://www.typescriptlang.org/ |
| **Vite** | 5.4.x | Build Tool & Dev Server | https://vitejs.dev/ |
| **React Router** | 6.26.x | Client-side Routing | https://reactrouter.com/ |
| **@monorepo/core** | workspace:* | Shared Components | ../core/README.md |
| **ESLint** | 9.x | Linting | https://eslint.org/ |
| **Vitest** | 2.1.x | Testing | https://vitest.dev/ |

---

## 🛠 Commands

### Development

```bash
# Start dev server with HMR
pnpm dev

# Start dev server and open browser
pnpm dev --open

# Start dev server on specific port
pnpm dev --port 3000

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Lint code
pnpm lint

# Type check
pnpm type-check
```

### Production

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Build and preview
pnpm build && pnpm preview
```

---

## 📁 Project Structure

```
packages/web/
├── public/             # Static assets
│   └── vite.svg
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── vite-env.d.ts   # Vite type definitions
├── index.html          # HTML template
├── package.json
├── tsconfig.json       # TypeScript config
├── tsconfig.app.json   # App-specific TS config
├── tsconfig.node.json  # Node-specific TS config
├── vite.config.ts      # Vite configuration
└── README.md
```

---

## 🔧 Configuration Files

### `package.json`

```json
{
  "name": "@monorepo/web",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "@monorepo/core": "workspace:*"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "^5.6.2",
    "vite": "^5.4.10"
  }
}
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, '../core/src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020',
  },
});
```

### `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["../core/src/*"]
    },
    "resolveJsonModule": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 📖 Using Shared Components

### Import from Core Package

```typescript
// src/App.tsx
import { Button, Card, useCounter } from '@monorepo/core';

function App() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <Card>
      <h1>Counter: {count}</h1>
      <Button onClick={increment}>Increment</Button>
      <Button onClick={decrement}>Decrement</Button>
      <Button onClick={reset}>Reset</Button>
    </Card>
  );
}

export default App;
```

### Path Aliases

```typescript
// Use @ for local imports
import { Header } from '@/components/Header';
import { formatDate } from '@/utils/date';

// Use @core for direct core package imports (optional)
import { Button } from '@core/components/Button';
```

---

## 🎨 Styling Options

### CSS Modules (Recommended)

```typescript
// Component.module.css
import styles from './Component.module.css';

function Component() {
  return <div className={styles.container}>Content</div>;
}
```

### Tailwind CSS (Optional)

```bash
# Install Tailwind
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Styled Components (Optional)

```bash
# Install styled-components
pnpm add styled-components
pnpm add -D @types/styled-components
```

---

## 🧪 Testing

This package uses **Vitest** and **Testing Library**.

```bash
# Install testing dependencies
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Run tests
pnpm test

# Watch mode
pnpm test:watch

# UI mode
pnpm test:ui
```

### Example Test

```typescript
// src/components/__tests__/App.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/counter/i)).toBeInTheDocument();
  });
});
```

---

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

This creates an optimized production build in the `dist/` directory.

### Deploy to Popular Platforms

#### **Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or connect GitHub repository at https://vercel.com
```

#### **Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Or drag & drop dist folder at https://app.netlify.com
```

#### **GitHub Pages**
```bash
# Install gh-pages
pnpm add -D gh-pages

# Add to package.json scripts:
# "deploy": "vite build && gh-pages -d dist"

pnpm deploy
```

#### **Docker**
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔄 Environment Variables

Create `.env` file for environment-specific configuration:

```bash
# .env.local
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=My App
```

Usage in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;
```

**Note:** All environment variables must be prefixed with `VITE_` to be exposed to the client.

---

## 🔄 Version Management

```bash
# Check outdated packages
pnpm outdated

# Update dependencies
pnpm update --latest

# Update Vite specifically
pnpm update vite@latest @vitejs/plugin-react@latest
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Use different port
pnpm dev -- --port 3000
```

### Core Package Not Found

```bash
# Build core package first
cd ../core
pnpm build
cd ../web
pnpm install
```

### Clear Cache

```bash
# Remove cache and rebuild
rm -rf node_modules/.vite
pnpm dev
```

### Type Errors from Core

```bash
# Rebuild core with types
cd ../core
pnpm build --dts
```

---

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Vitest Documentation](https://vitest.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
