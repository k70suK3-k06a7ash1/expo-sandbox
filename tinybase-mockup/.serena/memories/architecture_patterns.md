# Architecture and Design Patterns

## Data Flow Architecture

### 1. TinyBase Store (Singleton Pattern)
- Central store with lazy initialization
- Stores `Task` and `User` entities in separate tables
- Auto-loads from AsyncStorage on startup
- Falls back to sample data if storage is empty

### 2. Persistence Layer
- Auto-save with 500ms debounce
- AsyncStorage integration for React Native
- Export/import capabilities for data backup
- Located in `lib/persistence.ts`

### 3. Service Layer Pattern
Static classes that abstract TinyBase API:
- `TaskService` - All task-related CRUD operations
- `UserService` - All user-related CRUD operations
- Provides consistent interface for data access
- Keeps components clean and focused on UI

### 4. React Integration Layer
Custom hooks provide reactive data access:
- `useTasks()` - Get all tasks with automatic updates
- `useUsers()` - Get all users with automatic updates  
- `useTask(id)` - Get specific task with automatic updates
- `useUser(id)` - Get specific user with automatic updates

### 5. UI Components
- Use hooks for automatic re-rendering on data changes
- Expo Router for file-based navigation
- Tab navigation structure

## Key Design Decisions

### TinyBase Integration Patterns
- **Store singleton**: Ensures single source of truth
- **Table/Row listeners**: Enable granular reactivity
- **Service abstraction**: Hides TinyBase API complexity
- **Automatic persistence**: Transparent data saving

### Path Aliases
- `@/*` imports from project root for cleaner code
- Reduces relative import complexity
- Configured in `tsconfig.json`