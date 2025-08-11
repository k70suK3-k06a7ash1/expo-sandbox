import { createStore, Store } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { Platform } from 'react-native';

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
  avatar: string;
  createdAt: number;
}

// Create the TinyBase store with persistence
let store: Store;
let persister: any;

const initializeSampleData = () => {
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
        description: 'Implement data persistence with TinyBase SQLite',
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
};

export const getStore = (): Store => {
  if (!store) {
    store = createStore();
    
    // Create platform-specific persister using dynamic imports
    const initializePersister = async () => {
      if (Platform.OS === 'web') {
        persister = createLocalPersister(store, 'tinybase_data');
      } else {
        // Dynamic import for native platforms to avoid bundling in web
        const { createExpoSqlitePersister } = await import('tinybase/persisters/persister-expo-sqlite');
        const SQLite = await import('expo-sqlite');
        persister = createExpoSqlitePersister(store, SQLite.openDatabaseSync('tinybase.db'));
      }
    
      // Load persisted data and start auto-save
      return persister.load().then(() => {
        // Check if we have any data, if not, initialize with sample data
        const tables = store.getTables();
        const hasData = Object.keys(tables).length > 0 && 
                        (Object.keys(tables.tasks || {}).length > 0 || 
                         Object.keys(tables.users || {}).length > 0);
        
        if (!hasData) {
          initializeSampleData();
        }
        
        // Start auto-save after loading/initializing data
        persister.startAutoSave();
      }).catch((error: Error) => {
        console.error('Failed to load persisted data:', error);
        // Initialize with sample data if loading fails
        initializeSampleData();
        persister.startAutoSave();
      });
    };
    
    // Initialize persister asynchronously
    initializePersister().catch((error) => {
      console.error('Failed to initialize persister:', error);
      // Fallback to sample data without persistence
      initializeSampleData();
    });
  }
  
  return store;
};

// Export functions for data import/export functionality
export const exportData = async (): Promise<string> => {
  const tables = store?.getTables() || {};
  return JSON.stringify(tables, null, 2);
};

export const importData = async (jsonData: string): Promise<boolean> => {
  try {
    const tables = JSON.parse(jsonData);
    if (store) {
      store.setTables(tables);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

export const clearData = async (): Promise<void> => {
  if (store) {
    store.delTables();
  }
};

// Helper function to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};