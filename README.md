# React Ecosystem Monorepo

A monorepo containing multiple React-based projects for learning and sharing core components across different React ecosystems.

## 🎯 Purpose

This project serves as a centralized repository for:
- Learning React and its ecosystem
- Sharing reusable components and utilities
- Demonstrating cross-platform React development
- Maintaining consistent patterns across web, mobile, and server-rendered applications

## 📁 Structure

- `packages/core` - Core shared components, utilities, and hooks
- `packages/web` - React web application (Vite)
- `packages/nextjs` - Next.js server-rendered application
- `packages/mobile` - React Native mobile application

---

## 🚀 Quick Start

### Prerequisites

Before starting, ensure you have the following installed:

#### **Node.js & npm/pnpm**
- **Recommended:** Node.js v20.x LTS or v22.x
- **Package Manager:** pnpm (recommended) or npm

#### **Installation by Platform:**

##### **Windows**
```bash
# Using Node Version Manager (nvm-windows)
# Download from: https://github.com/coreybutler/nvm-windows/releases
# After installing nvm:
nvm install 20
nvm use 20

# Install pnpm globally
npm install -g pnpm@latest

# Verify installation
node --version
pnpm --version
```

##### **macOS**
```bash
# Using Homebrew
brew install node@20

# Or using nvm (Node Version Manager)
# Install nvm: https://github.com/nvm-sh/nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20

# Install pnpm globally
npm install -g pnpm@latest

# Verify installation
node --version
pnpm --version
```

##### **Linux (Ubuntu/Debian)**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Install pnpm globally
npm install -g pnpm@latest

# Verify installation
node --version
pnpm --version
```

##### **Linux (Fedora/RHEL/CentOS)**
```bash
# Using NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install pnpm globally
npm install -g pnpm@latest

# Verify installation
node --version
pnpm --version
```

---

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:minearithmeticop/unname-project-1.git
   cd unname-project-1
   ```

2. **Install dependencies**
   ```bash
   # Using pnpm (recommended for monorepo)
   pnpm install

   # Or using npm
   npm install
   ```

3. **Build all packages**
   ```bash
   # Build core package first (required by others)
   pnpm --filter @monorepo/core build

   # Build all packages
   pnpm -r build
   ```

---

## 🔧 Development

### Run specific package

```bash
# Core package
pnpm --filter @monorepo/core dev

# Web application
pnpm --filter @monorepo/web dev

# Next.js application
pnpm --filter @monorepo/nextjs dev

# Mobile application
pnpm --filter @monorepo/mobile start
```

### Run all packages concurrently

```bash
pnpm dev
```

---

## 📚 Documentation

Each package has its own detailed documentation:

- [Core Package Documentation](./packages/core/README.md)
- [Web Package Documentation](./packages/web/README.md)
- [Next.js Package Documentation](./packages/nextjs/README.md)
- [Mobile Package Documentation](./packages/mobile/README.md)

---

## 🛠 Tech Stack

| Package | Technologies | Version |
|---------|-------------|---------|
| Core | React, TypeScript | React 19.x |
| Web | React, Vite, TypeScript | Vite 6.x |
| Next.js | Next.js, React, TypeScript | Next.js 15.x |
| Mobile | React Native, Expo, Supabase | Expo SDK 54.x |

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test across packages if core changes are made
4. Submit a pull request

---

## 📝 License

MIT
