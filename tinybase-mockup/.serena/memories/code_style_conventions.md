# Code Style and Conventions

## TypeScript Configuration
- **Strict mode**: Enabled for better type safety
- **Path aliases**: `@/*` maps to project root for clean imports
- **Extends**: `expo/tsconfig.base` for Expo-specific settings

## Code Organization Patterns

### Service Layer Pattern
- Static classes for business logic (e.g., `TaskService`, `UserService`)
- Methods are static for easy access without instantiation
- Centralized data access through service classes

### Data Entity Interfaces
```typescript
interface Task {
  id: string;
  title: string; 
  description: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: number;
}
```

### Hook Patterns
- Custom hooks for TinyBase integration (`useTasks()`, `useUsers()`, etc.)
- Automatic re-rendering on data changes
- Clean separation between data layer and UI

### File Structure Conventions
- `lib/` - Core business logic, services, and data layer
- `hooks/` - Custom React hooks
- `components/` - Reusable UI components  
- `app/` - Expo Router pages
- `__tests__/` - Test files alongside source code

## ESLint Configuration
- Uses `eslint-config-expo/flat` configuration
- Ignores `dist/*` directory
- Standard Expo linting rules applied