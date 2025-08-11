import { beforeEach, vi } from 'vitest';

// Mock SQLite since project uses expo-sqlite instead of AsyncStorage
const mockSQLite = {
  openDatabaseAsync: vi.fn(() => Promise.resolve({
    execAsync: vi.fn(() => Promise.resolve()),
    getAllAsync: vi.fn(() => Promise.resolve([])),
    getFirstAsync: vi.fn(() => Promise.resolve(null)),
    runAsync: vi.fn(() => Promise.resolve({ lastInsertRowId: 1, changes: 1 })),
  })),
};

vi.mock('expo-sqlite', () => ({
  SQLiteProvider: ({ children }: any) => children,
  useSQLiteContext: () => mockSQLite,
  openDatabaseAsync: mockSQLite.openDatabaseAsync,
}));

vi.mock('react-native', () => ({
  Alert: {
    alert: vi.fn(),
  },
  Platform: {
    OS: 'ios',
    select: vi.fn((obj) => obj.ios || obj.default),
  },
  Dimensions: {
    get: vi.fn(() => ({ width: 375, height: 812 })),
  },
  StyleSheet: {
    create: vi.fn((styles) => styles),
  },
  Text: 'Text',
  View: 'View', 
  ScrollView: 'ScrollView',
  TouchableOpacity: 'TouchableOpacity',
  TextInput: 'TextInput',
  Modal: 'Modal',
  Image: 'Image',
}));

// Mock Expo modules
vi.mock('expo-image', () => ({
  Image: 'Image',
}));

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});