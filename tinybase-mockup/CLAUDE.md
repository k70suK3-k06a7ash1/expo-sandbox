# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Available Commands

### Development
- `npm start` - Start the Expo development server
- `npm run android` - Start on Android emulator/device
- `npm run ios` - Start on iOS simulator/device  
- `npm run web` - Start web development server
- `npm run lint` - Run ESLint to check code quality

### Utilities
- `npm run reset-project` - Reset project to initial state using custom script

## Project Architecture

This is an Expo React Native application demonstrating TinyBase implementation for local-first data management with CRUD operations.

### Core Data Layer
- **TinyBase Store** (`lib/store.ts`): Centralized store initialization with `Task` and `User` entities
- **Persistence** (`lib/persistence.ts`): AsyncStorage integration with auto-save, export/import capabilities
- **Services** (`lib/taskService.ts`, `lib/userService.ts`): Business logic layers providing CRUD operations and utilities

### Data Flow Pattern
1. **Initialization**: Store auto-loads from AsyncStorage, falls back to sample data if empty
2. **Real-time Updates**: TinyBase listeners trigger React component re-renders automatically
3. **Persistence**: Auto-save with 500ms debounce writes all changes to AsyncStorage
4. **Service Layer**: Static classes handle all business logic, keeping components clean

### React Integration
- **Custom Hooks** (`hooks/useTinyBase.ts`): `useTasks()`, `useUsers()`, `useTask(id)`, `useUser(id)` provide reactive data access
- **Components**: Use hooks for automatic re-rendering on data changes
- **Expo Router**: File-based routing with tab navigation structure

### Key Data Entities
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

### TinyBase Integration Patterns
- Store singleton pattern with lazy initialization
- Automatic persistence with debounced saves
- Table/Row listeners for granular reactivity
- Service classes abstract TinyBase API for consistent data access

### Import Paths
Uses `@/*` path mapping (configured in `tsconfig.json`) for clean imports from project root.

## Development Notes

- The app uses React Native 0.79.5 with React 19
- TinyBase version 6.5.1 handles all state management
- Expo SDK ~53 with new architecture enabled
- TypeScript with strict mode enabled
- No test framework currently configured