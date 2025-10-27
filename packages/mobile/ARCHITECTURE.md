# 🏗️ Mobile App Architecture

This document explains the architecture patterns and design principles used in this React Native/Expo mobile application.

---

## 📐 Architecture Overview

This project follows **Clean Architecture** principles combined with **Atomic Design** for components, ensuring:
- **Maintainability**: Easy to understand and modify
- **Scalability**: Can grow without becoming complex
- **Testability**: Components and logic are isolated
- **Reusability**: Shared components across the app

---

## 🎨 Design Patterns Used

### 1. **Atomic Design Pattern**

We organize UI components into a hierarchy:

```
components/
├── atoms/       → Basic building blocks (Button, Typography)
├── molecules/   → Simple combinations (Card, SearchBar)
└── organisms/   → Complex components (Header, Form)
```

#### **Atoms** - Basic Building Blocks
- **Purpose**: Smallest reusable components
- **Examples**: Button, Typography, Input, Icon
- **Rules**:
  - No business logic
  - Highly reusable
  - No external dependencies
  - Props-driven

**Example:**
```typescript
// src/components/atoms/Button.tsx
<Button variant="primary" onPress={handlePress}>
  Click Me
</Button>
```

#### **Molecules** - Simple Combinations
- **Purpose**: Combine atoms into functional groups
- **Examples**: Card (Typography + Button), SearchBar (Input + Icon)
- **Rules**:
  - Combine 2+ atoms
  - Single responsibility
  - Reusable across features

**Example:**
```typescript
// src/components/molecules/Card.tsx
<Card 
  title="Welcome"
  description="Get started"
  onPress={handlePress}
  buttonText="Continue"
/>
```

#### **Organisms** - Complex Components
- **Purpose**: Complex UI sections
- **Examples**: Header, Navigation, CompleteForm
- **Rules**:
  - Combine molecules and atoms
  - Can have local state
  - Feature-specific

---

### 2. **Feature-Based Architecture**

Organize code by features, not by technical type:

```
features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── screens/
│   └── types/
└── products/
    ├── components/
    ├── hooks/
    ├── screens/
    └── types/
```

**Benefits:**
- ✅ Related code stays together
- ✅ Easy to find and modify
- ✅ Scalable for large apps
- ✅ Team can work on features independently

---

### 3. **Custom Hooks Pattern**

Extract reusable logic into custom hooks:

```typescript
// src/hooks/useCounter.ts
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}
```

**Usage:**
```typescript
const { count, increment, decrement } = useCounter(0);
```

**Rules:**
- ✅ Start with `use` prefix
- ✅ Pure logic, no UI
- ✅ Reusable across components
- ✅ Follow React hooks rules

---

### 4. **Context API Pattern**

Manage global state with Context:

```typescript
// src/contexts/ThemeContext.tsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

**When to use:**
- ✅ Theme configuration
- ✅ User authentication
- ✅ App settings
- ✅ Data shared across many components

**When NOT to use:**
- ❌ Frequently changing data (use state management library)
- ❌ Data used in only 1-2 components (use props)

---

### 5. **Container/Presentational Pattern**

Separate logic from UI:

```typescript
// Container (Logic)
function UserListContainer() {
  const { users, loading } = useUsers();
  return <UserListView users={users} loading={loading} />;
}

// Presentational (UI)
function UserListView({ users, loading }) {
  if (loading) return <Spinner />;
  return <FlatList data={users} ... />;
}
```

**Benefits:**
- ✅ Easier to test
- ✅ Reusable UI components
- ✅ Clear separation of concerns

---

## 📁 Folder Structure

```
packages/mobile/
├── app/                      # Expo Router (screens)
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Home screen
│   │   └── profile.tsx      # Profile screen
│   ├── _layout.tsx          # Root layout
│   └── +not-found.tsx       # 404 screen
│
├── src/
│   ├── components/          # UI Components (Atomic Design)
│   │   ├── atoms/           # Basic components
│   │   │   ├── Button.tsx
│   │   │   └── Typography.tsx
│   │   ├── molecules/       # Combined components
│   │   │   └── Card.tsx
│   │   └── organisms/       # Complex components
│   │
│   ├── features/            # Feature modules
│   │   ├── auth/
│   │   ├── products/
│   │   └── profile/
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
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   │
│   └── constants/           # App constants
│       └── index.ts
│
├── assets/                  # Images, fonts, etc.
├── package.json
├── tsconfig.json
├── app.json
└── README.md
```

---

## 🎯 Naming Conventions

### **Files & Folders**
```
✅ PascalCase for components:  Button.tsx, UserProfile.tsx
✅ camelCase for utilities:    formatDate.ts, apiClient.ts
✅ camelCase for hooks:        useUser.ts, useAuth.ts
✅ lowercase for folders:      components/, utils/, hooks/
```

### **Components**
```typescript
✅ Export function components
export function Button({ ... }) { }

✅ Use descriptive names
UserProfileCard ✅
UPC ❌

✅ Props interface with component name
interface ButtonProps { }
```

### **Hooks**
```typescript
✅ Start with 'use' prefix
export function useCounter() { }
export function useAuth() { }

❌ Don't use without prefix
export function counter() { } // Wrong!
```

### **Constants**
```typescript
✅ UPPER_SNAKE_CASE for constants
export const API_BASE_URL = '...';
export const MAX_RETRY_COUNT = 3;
```

---

## 🔄 State Management Strategy

### **Local State** (useState)
Use for component-specific state:
```typescript
const [isOpen, setIsOpen] = useState(false);
```

### **Shared State** (Context)
Use for theme, auth, settings:
```typescript
const { theme, setTheme } = useTheme();
```

### **Server State** (React Query/SWR)
Use for API data:
```typescript
const { data, isLoading } = useSWR('/api/users', fetcher);
```

### **Global State** (Zustand - if needed)
Use for complex app-wide state:
```typescript
const { user, setUser } = useUserStore();
```

---

## 🧪 Testing Strategy

### **Unit Tests**
- Test utilities, hooks, business logic
- Location: `__tests__/` next to source
```typescript
// useCounter.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './useCounter';
```

### **Component Tests**
- Test rendering and interactions
```typescript
// Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';
```

### **Integration Tests**
- Test feature workflows
- Test screen navigation

---

## 📝 Code Style Guidelines

### **TypeScript**
- ✅ Always use TypeScript
- ✅ Define interfaces for props
- ✅ Avoid `any` type
- ✅ Use strict mode

### **Components**
- ✅ Keep components small (< 200 lines)
- ✅ Extract logic to hooks
- ✅ Use functional components
- ✅ Avoid nested ternaries

### **Imports**
```typescript
// Order: React → Third-party → Local
import { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/atoms';
import { useAuth } from '@/hooks';
```

---

## 🚀 Performance Best Practices

### **React Native Specific**
```typescript
// ✅ Use memo for expensive renders
export const ExpensiveComponent = memo(({ data }) => { ... });

// ✅ Use useCallback for functions passed as props
const handlePress = useCallback(() => { ... }, []);

// ✅ Use useMemo for expensive computations
const sortedData = useMemo(() => data.sort(), [data]);

// ✅ Optimize FlatList
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

---

## 🎨 Styling Strategy

### **StyleSheet API**
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

### **Shared Constants**
```typescript
import { COLORS, SPACING } from '@/constants';

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
  },
});
```

### **Platform-Specific Styles**
```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },
});
```

---

## 📚 Learning Resources

### **Patterns**
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [React Patterns](https://reactpatterns.com/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### **React Native**
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Hooks](https://react.dev/reference/react)

---

## 🤝 Contributing

When adding new code:

1. ✅ Follow existing patterns
2. ✅ Place files in correct folders
3. ✅ Use TypeScript
4. ✅ Add JSDoc comments for complex logic
5. ✅ Keep components small and focused
6. ✅ Write tests for business logic

---

## 📖 Related Documentation

- [README.md](./README.md) - Setup and installation
- [API Documentation](./docs/api.md) - API integration guide
- [Component Library](./docs/components.md) - Component usage examples

---

**Remember**: These patterns are guidelines, not strict rules. Use them when they add value, not when they add complexity. Start simple and refactor when needed! 🎯
