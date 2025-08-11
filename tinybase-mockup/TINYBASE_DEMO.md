# TinyBase CRUD Demo for Expo

This project demonstrates a complete CRUD (Create, Read, Update, Delete) data flow implementation using TinyBase in an Expo React Native application.

## 🚀 Features

### Core CRUD Operations
- **Create**: Add new tasks and users
- **Read**: View, filter, and search tasks and users
- **Update**: Edit existing tasks and users
- **Delete**: Remove individual items or batch delete completed tasks

### Real-time Updates
- Automatic UI updates when data changes
- React hooks integration with TinyBase listeners
- Optimistic updates for smooth user experience

### Data Persistence
- Automatic saving to AsyncStorage
- Data survives app restarts
- Import/export functionality
- Debounced auto-save to optimize performance

### Advanced Features
- Search functionality for both tasks and users
- Task filtering (All, Active, Completed)
- User avatar support with automatic generation
- Form validation and error handling
- Modal-based forms with proper UX

## 📁 Project Structure

```
lib/
├── store.ts           # TinyBase store setup and configuration
├── taskService.ts     # Task CRUD operations and business logic
├── userService.ts     # User CRUD operations and business logic
└── persistence.ts     # Data persistence and storage management

hooks/
└── useTinyBase.ts     # React hooks for TinyBase integration

app/(tabs)/
├── index.tsx          # Task management screen (CRUD demo)
└── explore.tsx        # User management screen
```

## 🎯 Data Models

### Task Model
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### User Model
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: number;
}
```

## 🔧 Key Components

### 1. Store Management (`lib/store.ts`)
- Initializes TinyBase store
- Manages persistence with AsyncStorage
- Provides sample data for first-time users
- Auto-save functionality with debouncing

### 2. Service Layer (`lib/taskService.ts`, `lib/userService.ts`)
- Encapsulates all CRUD operations
- Business logic for data validation
- Search and filtering capabilities
- Batch operations support

### 3. React Integration (`hooks/useTinyBase.ts`)
- Custom hooks for seamless React integration
- Automatic re-renders on data changes
- Optimized listeners for specific entities

### 4. Persistence Layer (`lib/persistence.ts`)
- AsyncStorage integration
- Auto-save with configurable delays
- Import/export functionality
- Error handling for storage operations

## 🎨 UI Features

### Task Management (Home Tab)
- ✅ Add new tasks with title and description
- ✅ Mark tasks as complete/incomplete
- ✅ Edit existing tasks
- ✅ Delete individual tasks
- ✅ Filter tasks (All/Active/Completed)
- ✅ Batch delete completed tasks
- ✅ Real-time task counter

### User Management (Explore Tab)
- 👤 Add new users with validation
- 👤 Search users by name or email
- 👤 Edit user information
- 👤 Delete users
- 👤 Avatar support with preview
- 👤 User creation date tracking

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```

3. **Run on Your Platform**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## 💾 Data Flow

```
User Interaction
       ↓
UI Component (React)
       ↓
Custom Hook (useTinyBase)
       ↓
Service Layer (TaskService/UserService)
       ↓
TinyBase Store
       ↓
Persistence Layer (AsyncStorage)
       ↓
React Hook Updates
       ↓
UI Re-renders
```

## 🔍 TinyBase Benefits Demonstrated

1. **Reactive Data**: Automatic UI updates when data changes
2. **Performance**: Efficient listeners and minimal re-renders
3. **Simplicity**: Clean API for complex state management
4. **Flexibility**: Easy to add new tables and relationships
5. **Persistence**: Built-in support for data persistence
6. **Type Safety**: Full TypeScript integration

## 🛠 Advanced Usage Examples

### Adding a New Entity
```typescript
// 1. Define the interface
interface Project {
  id: string;
  name: string;
  userId: string;
  status: 'active' | 'completed';
  createdAt: number;
}

// 2. Create service class
export class ProjectService {
  static createProject(data: Omit<Project, 'id' | 'createdAt'>): Project {
    // Implementation
  }
  // ... other CRUD methods
}

// 3. Add React hook
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  // ... hook implementation
};
```

### Custom Queries
```typescript
// Find tasks by user with status
static getTasksByUserAndStatus(userId: string, completed: boolean): Task[] {
  return this.getAllTasks().filter(task => 
    task.userId === userId && task.completed === completed
  );
}

// Complex search with multiple criteria
static advancedSearch(query: SearchCriteria): Task[] {
  return this.getAllTasks().filter(task => {
    // Complex filtering logic
  });
}
```

## 🎉 Demo Highlights

This implementation showcases:
- **Complete CRUD workflows** for two different entity types
- **Real-time synchronization** between UI and data store
- **Persistent storage** that survives app restarts
- **Professional UI/UX** with forms, modals, and feedback
- **Error handling** and validation throughout
- **TypeScript integration** for type safety
- **React hooks patterns** for clean component logic
- **Service layer architecture** for maintainable code

Perfect for learning TinyBase fundamentals and building production-ready apps! 🚀