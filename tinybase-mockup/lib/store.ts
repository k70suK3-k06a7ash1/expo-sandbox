import { createStore, Store } from 'tinybase';
import { PersistenceManager } from './persistence';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: number;
}

// Create the TinyBase store
let store: Store;
let persistenceManager: PersistenceManager;

export const getStore = (): Store => {
  if (!store) {
    store = createStore();
    persistenceManager = new PersistenceManager(store);
    
    // Load persisted data first
    persistenceManager.loadFromStorage().then(() => {
      // Check if we have any data, if not, initialize with sample data
      const tables = store.getTables();
      const hasData = Object.keys(tables).length > 0 && 
                      (Object.keys(tables.tasks || {}).length > 0 || 
                       Object.keys(tables.users || {}).length > 0);
      
      if (!hasData) {
        // Initialize with some sample data only if no persisted data exists
        store.setTables({
          tasks: {
            '1': {
              id: '1',
              title: 'Learn TinyBase',
              description: 'Understand how to use TinyBase for state management',
              completed: false,
              createdAt: Date.now() - 86400000,
              updatedAt: Date.now() - 86400000,
            },
            '2': {
              id: '2',
              title: 'Build CRUD app',
              description: 'Create a full CRUD application with TinyBase',
              completed: false,
              createdAt: Date.now() - 3600000,
              updatedAt: Date.now() - 3600000,
            },
            '3': {
              id: '3',
              title: 'Add persistence',
              description: 'Implement data persistence with AsyncStorage',
              completed: true,
              createdAt: Date.now() - 7200000,
              updatedAt: Date.now() - 1800000,
            },
          },
          users: {
            'user1': {
              id: 'user1',
              name: 'John Doe',
              email: 'john@example.com',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
              createdAt: Date.now() - 86400000 * 7,
            },
            'user2': {
              id: 'user2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
              createdAt: Date.now() - 86400000 * 3,
            },
          },
        });
      }
    });
    
    // Enable auto-save functionality
    persistenceManager.enableAutoSave(500);
  }
  
  return store;
};

export const getPersistenceManager = (): PersistenceManager => {
  if (!persistenceManager) {
    getStore(); // This will initialize both store and persistenceManager
  }
  return persistenceManager;
};

// Helper function to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};