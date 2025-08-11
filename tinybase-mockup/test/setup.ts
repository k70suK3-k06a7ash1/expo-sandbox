import { beforeEach, vi } from 'vitest';

// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: vi.fn(() => Promise.resolve(null)),
  setItem: vi.fn(() => Promise.resolve()),
  removeItem: vi.fn(() => Promise.resolve()),
  clear: vi.fn(() => Promise.resolve()),
  getAllKeys: vi.fn(() => Promise.resolve([])),
  multiGet: vi.fn(() => Promise.resolve([])),
  multiSet: vi.fn(() => Promise.resolve()),
  multiRemove: vi.fn(() => Promise.resolve()),
};

// Mock React Native modules
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: mockAsyncStorage,
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