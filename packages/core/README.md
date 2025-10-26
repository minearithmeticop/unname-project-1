# @monorepo/core

Core shared components, utilities, hooks, and types for the React ecosystem monorepo.

## 📦 Purpose

This package provides reusable building blocks that can be consumed by:
- Web applications (Vite/React)
- Server-rendered applications (Next.js)
- Mobile applications (React Native with compatible components)

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 20.x or higher
- pnpm 8.x or higher (recommended)

### Initial Setup

```bash
# Navigate to core package
cd packages/core

# Install dependencies
pnpm install

# Build the package
pnpm build

# Run in development mode (watch mode)
pnpm dev
```

---

## 📚 Tech Stack

| Technology | Version | Purpose | Documentation |
|-----------|---------|---------|---------------|
| **React** | 18.3.1 | UI Library | https://react.dev/ |
| **TypeScript** | 5.6.x | Type Safety | https://www.typescriptlang.org/ |
| **tsup** | 8.3.x | Build Tool | https://tsup.egoist.dev/ |
| **Vitest** | 2.1.x | Testing Framework | https://vitest.dev/ |
| **ESLint** | 9.x | Linting | https://eslint.org/ |

---

## 🛠 Commands

### Development

```bash
# Start development mode with watch
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Type check
pnpm type-check
```

### Production

```bash
# Build for production
pnpm build

# Build with type declarations
pnpm build --dts
```

---

## 📁 Project Structure

```
packages/core/
├── src/
│   ├── components/     # Shared React components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── index.ts        # Main entry point
├── tests/              # Test files
├── package.json
├── tsconfig.json
├── tsup.config.ts      # Build configuration
└── README.md
```

---

## 🔧 Configuration Files

### `package.json`

```json
{
  "name": "@monorepo/core",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### `tsup.config.ts`

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
});
```

---

## 📖 Usage in Other Packages

### In Web Package (Vite)

```typescript
// packages/web/src/App.tsx
import { Button, useCounter } from '@monorepo/core';

function App() {
  const { count, increment } = useCounter();
  
  return <Button onClick={increment}>Count: {count}</Button>;
}
```

### In Next.js Package

```typescript
// packages/nextjs/app/page.tsx
'use client';
import { Button } from '@monorepo/core';

export default function Home() {
  return <Button>Click me</Button>;
}
```

### In Mobile Package (React Native)

```typescript
// packages/mobile/App.tsx
import { useCounter } from '@monorepo/core';
// Note: Only use platform-agnostic utilities and hooks

function App() {
  const { count, increment } = useCounter();
  // Use React Native components for UI
}
```

---

## 🧪 Testing

This package uses **Vitest** for testing.

```bash
# Run all tests
pnpm test

# Watch mode during development
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Test Structure

```
tests/
├── components/
│   └── Button.test.tsx
├── hooks/
│   └── useCounter.test.ts
└── utils/
    └── helpers.test.ts
```

---

## 🔄 Version Management

When updating dependencies:

```bash
# Check for outdated packages
pnpm outdated

# Update all dependencies to latest
pnpm update --latest

# Update specific package
pnpm update react@latest
```

---

## 📝 Best Practices

1. **Platform Agnostic**: Keep components and utilities platform-agnostic when possible
2. **Tree Shaking**: Export only what's needed to enable tree shaking
3. **Type Safety**: Always provide TypeScript types for exports
4. **Testing**: Write tests for all public APIs
5. **Documentation**: Document complex utilities and hooks with JSDoc

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf dist node_modules
pnpm install
pnpm build
```

### Type Errors in Consumer Packages

```bash
# Ensure types are generated
pnpm build --dts

# Check type exports in package.json
```

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [tsup Documentation](https://tsup.egoist.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Monorepo Best Practices](https://monorepo.tools/)
