# @monorepo/mobile

React Native mobile application built with Expo for iOS and Android.

> 📐 **For detailed architecture and design patterns, see [ARCHITECTURE.md](./ARCHITECTURE.md)**

## 📦 Purpose

A cross-platform mobile application that:
- Uses shared utilities and hooks from `@monorepo/core`
- Supports iOS and Android with a single codebase
- Leverages Expo for simplified development and deployment
- Demonstrates mobile best practices with React Native
- Follows **Atomic Design** and **Clean Architecture** patterns

---

## 🏗️ Architecture Highlights

This project follows these design patterns:
- ✅ **Atomic Design** - Components organized as atoms, molecules, organisms
- ✅ **Feature-Based Structure** - Code organized by features, not file types
- ✅ **Custom Hooks Pattern** - Reusable logic extracted into hooks
- ✅ **Context API** - Global state management
- ✅ **Clean Architecture** - Separation of concerns

**👉 [Read full architecture documentation →](./ARCHITECTURE.md)**

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 20.x or higher
- pnpm 8.x or higher (recommended)
- Built `@monorepo/core` package

#### Platform-Specific Requirements:

##### **Windows**
```bash
# Install Android Studio
# Download from: https://developer.android.com/studio

# Add environment variables to ~/.bashrc or ~/.bash_profile:
export ANDROID_HOME=$HOME/AppData/Local/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Reload shell
source ~/.bashrc
```

##### **macOS**
```bash
# Install Xcode (for iOS development)
xcode-select --install

# Install Watchman
brew install watchman

# Install CocoaPods (for iOS)
sudo gem install cocoapods

# Install Android Studio (for Android)
# Download from: https://developer.android.com/studio
```

##### **Linux (Ubuntu/Debian)**
```bash
# Install JDK
sudo apt update
sudo apt install openjdk-17-jdk

# Install Android Studio
# Download from: https://developer.android.com/studio

# Install Watchman
sudo apt install watchman

# Add environment variables to ~/.bashrc:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

source ~/.bashrc
```

### Initial Setup

```bash
# Navigate to mobile package
cd packages/mobile

# Install dependencies
pnpm install

# Install Expo CLI globally (optional, but recommended)
npm install -g expo-cli

# Start development server
pnpm start
```

---

## 📚 Tech Stack

| Technology | Version | Purpose | Documentation |
|-----------|---------|---------|---------------|
| **React Native** | 0.74.x | Mobile Framework | https://reactnative.dev/ |
| **Expo** | SDK 51.x | Development Platform | https://docs.expo.dev/ |
| **React** | 18.2.0 | UI Library | https://react.dev/ |
| **TypeScript** | 5.6.x | Type Safety | https://www.typescriptlang.org/ |
| **Expo Router** | 3.x | File-based Routing | https://docs.expo.dev/router/introduction/ |
| **@monorepo/core** | workspace:* | Shared Utilities | ../core/README.md |
| **React Native Paper** | 5.x | UI Components (optional) | https://callstack.github.io/react-native-paper/ |

---

## 🛠 Commands

### Development

```bash
# Start Expo dev server
pnpm start

# Start with cleared cache
pnpm start --clear

# Run on Android emulator
pnpm android

# Run on iOS simulator (macOS only)
pnpm ios

# Run on physical device (scan QR code)
# Use Expo Go app from App Store/Play Store

# Run on web (experimental)
pnpm web

# Type check
pnpm type-check

# Lint code
pnpm lint
```

### Production

```bash
# Build for Android (APK)
pnpm build:android

# Build for iOS (requires macOS)
pnpm build:ios

# Build with EAS (Expo Application Services)
eas build --platform android
eas build --platform ios
eas build --platform all
```

### Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

---

## 📁 Project Structure

```
packages/mobile/
├── app/                      # Expo Router (screens)
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Home screen
│   │   └── profile.tsx      # Profile screen
│   ├── _layout.tsx          # Root layout
│   └── +not-found.tsx       # 404 screen
│
├── src/                     # Source code
│   ├── components/          # UI Components (Atomic Design)
│   │   ├── atoms/           # Basic building blocks
│   │   │   ├── Button.tsx
│   │   │   └── Typography.tsx
│   │   ├── molecules/       # Combined components
│   │   │   └── Card.tsx
│   │   └── organisms/       # Complex components
│   │
│   ├── features/            # Feature modules
│   │   ├── auth/            # Authentication feature
│   │   ├── products/        # Products feature
│   │   └── profile/         # Profile feature
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useCounter.ts
│   │
│   ├── contexts/            # React Context providers
│   │   └── ThemeContext.tsx
│   │
│   ├── utils/               # Utility functions
│   │   └── helpers.ts
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   │
│   └── constants/           # App constants
│       └── index.ts
│
├── assets/                  # Images, fonts, etc.
├── docs/                    # Documentation
│   ├── API_INTEGRATION.md   # 🌐 API services guide
│   ├── API_EXAMPLES.md      # 💡 API integration examples
│   └── SECURITY.md          # 🔐 Security best practices
├── ARCHITECTURE.md          # 📐 Architecture documentation
├── .env.example             # ⚠️ Environment variables template
├── .gitignore               # 🚫 Files to ignore in git
├── package.json
├── tsconfig.json
├── app.json
└── README.md
```

**Note:** See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed explanation of each folder's purpose.

**API Integration:** See [docs/API_INTEGRATION.md](./docs/API_INTEGRATION.md) for free API services and [docs/API_EXAMPLES.md](./docs/API_EXAMPLES.md) for real-world examples.

**Security:** See [docs/SECURITY.md](./docs/SECURITY.md) for API key security and best practices.

---

## 🔧 Configuration Files

### `package.json`

```json
{
  "name": "@monorepo/mobile",
  "version": "0.1.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "19.1.0",
    "react-native": "0.81.5",
    "expo": "~54.0.20",
    "expo-router": "~6.0.13",
    "expo-status-bar": "~2.0.0",
    "@monorepo/core": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "~18.2.45",
    "typescript": "^5.6.2",
    "@babel/core": "^7.24.0"
  }
}
```

### `app.json`

```json
{
  "expo": {
    "name": "mobile-app",
    "slug": "mobile-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.mobileapp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.mobileapp"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "mobileapp"
  }
}
```

### `eas.json`

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### `metro.config.js`

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Resolve core package
config.resolver.extraNodeModules = {
  '@monorepo/core': path.resolve(workspaceRoot, 'packages/core'),
};

module.exports = config;
```

### `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@core/*": ["../core/src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"],
  "exclude": ["node_modules"]
}
```

---

## 📖 Using Shared Code

### Import from Components

```typescript
// Import from atoms
import { Button, Typography } from '@/components/atoms';

// Import from molecules
import { Card } from '@/components/molecules';

// Import hooks
import { useCounter } from '@/hooks';

// Import contexts
import { useTheme } from '@/contexts';

// Import utilities
import { formatDate, validateEmail } from '@/utils';

// Import constants
import { COLORS, SPACING } from '@/constants';
```

### Example Usage

```typescript
// app/(tabs)/index.tsx
import { View, StyleSheet } from 'react-native';
import { Button, Typography } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { useCounter } from '@/hooks';
import { COLORS, SPACING } from '@/constants';

export default function HomeScreen() {
  const { count, increment, decrement } = useCounter(0);
  
  return (
    <View style={styles.container}>
      <Card 
        title="Counter Demo"
        description={`Current count: ${count}`}
        onPress={increment}
        buttonText="Increment"
      />
      
      <Button variant="secondary" onPress={decrement}>
        Decrement
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
  },
});
```

### Import Utilities from Core Package

```typescript
// Import from monorepo core package
import { useCounter, formatDate } from '@monorepo/core';
import { View, Text, Button } from 'react-native';

export default function HomeScreen() {
  const { count, increment } = useCounter(0);
  
  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={increment} />
    </View>
  );
}
```

### Platform-Specific Code

```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: Platform.select({
      ios: 20,
      android: 16,
      default: 16,
    }),
  },
});

// Or use platform-specific files:
// Component.ios.tsx
// Component.android.tsx
// Component.tsx (fallback)
```

---

## 🎨 Styling

### StyleSheet API

```typescript
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default function Component() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
}
```

### React Native Paper (Optional)

```bash
pnpm add react-native-paper react-native-safe-area-context
```

```typescript
import { Button, Card } from 'react-native-paper';

export default function Component() {
  return (
    <Card>
      <Card.Content>
        <Button mode="contained">Press me</Button>
      </Card.Content>
    </Card>
  );
}
```

---

## 🚀 Building & Deployment

### Setup EAS (Expo Application Services)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

### Build APK (Android)

```bash
# Development build
eas build --profile development --platform android

# Production build
eas build --profile production --platform android

# Local build (requires Android SDK)
pnpm build:android
```

### Build IPA (iOS - requires macOS)

```bash
# Development build
eas build --profile development --platform ios

# Production build
eas build --profile production --platform ios

# Requires Apple Developer account ($99/year)
```

### Submit to App Stores

```bash
# Submit to Google Play
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

---

## 📱 Running on Devices

### Physical Device (Easiest)

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Run `pnpm start`
3. Scan QR code with camera (iOS) or Expo Go app (Android)

### Android Emulator

```bash
# Start emulator from Android Studio or:
emulator -avd Pixel_5_API_33

# Run app
pnpm android
```

### iOS Simulator (macOS only)

```bash
# List available simulators
xcrun simctl list devices

# Run app
pnpm ios
```

---

## 🔄 Environment Variables

```bash
# .env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_NAME=My App
```

Usage:

```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

**Note:** All environment variables must be prefixed with `EXPO_PUBLIC_` to be exposed.

---

## 🧪 Testing

### Unit Testing with Jest

```bash
pnpm add -D jest @testing-library/react-native
```

### E2E Testing with Detox

```bash
pnpm add -D detox
```

---

## 🔄 Version Management

```bash
# Check outdated packages
pnpm outdated

# Update Expo SDK
npx expo install --fix

# Update specific package
pnpm update expo@latest
```

---

## 🐛 Troubleshooting

### Clear Cache

```bash
pnpm start --clear
rm -rf node_modules
pnpm install
```

### Core Package Not Found

```bash
# Build core package
cd ../core
pnpm build
cd ../mobile
pnpm install
```

### Metro Bundler Issues

```bash
# Reset Metro cache
npx react-native start --reset-cache

# Or
watchman watch-del-all
rm -rf $TMPDIR/metro-*
```

### Android Build Issues

```bash
# Clean Gradle cache
cd android
./gradlew clean
cd ..
```

### iOS Build Issues (macOS)

```bash
# Clean iOS build
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

---

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Directory](https://reactnative.directory/) - Find libraries
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Expo Examples](https://github.com/expo/examples)

### Platform-Specific Guides

- [iOS Setup Guide](https://reactnative.dev/docs/environment-setup?platform=ios)
- [Android Setup Guide](https://reactnative.dev/docs/environment-setup?platform=android)
- [Publishing to App Stores](https://docs.expo.dev/distribution/introduction/)

---

## ⚠️ Important Notes

1. **Not all `@monorepo/core` components work in React Native** - Only use platform-agnostic utilities and hooks
2. **Native modules may require custom development client** - Use `eas build` for custom native code
3. **iOS development requires macOS** - Can't build for iOS on Windows/Linux
4. **Use Expo Go for quick testing** - For custom native modules, use development builds
