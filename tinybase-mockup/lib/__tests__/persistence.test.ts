import { describe, it, expect, beforeEach, vi } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistenceManager } from '../persistence';

// Mock TinyBase store
const mockStore = {
  getTables: vi.fn(),
  setTables: vi.fn(),
  addTablesListener: vi.fn(),
  delListener: vi.fn(),
};

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe('PersistenceManager', () => {
  let persistenceManager: PersistenceManager;

  beforeEach(() => {
    vi.clearAllMocks();
    persistenceManager = new PersistenceManager(mockStore as any);
  });

  describe('saveToStorage', () => {
    it('should save tables to AsyncStorage', async () => {
      const mockTables = {
        tasks: {
          'task1': { id: 'task1', title: 'Test Task', completed: false },
        },
        users: {
          'user1': { id: 'user1', name: 'Test User', email: 'test@example.com' },
        },
      };

      mockStore.getTables.mockReturnValue(mockTables);
      vi.mocked(AsyncStorage.setItem).mockResolvedValue();

      await persistenceManager.saveToStorage();

      expect(mockStore.getTables).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'tinybase_data',
        JSON.stringify(mockTables)
      );
    });

    it('should handle save errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockStore.getTables.mockReturnValue({});
      vi.mocked(AsyncStorage.setItem).mockRejectedValue(new Error('Storage error'));

      await persistenceManager.saveToStorage();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to save data to storage:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('loadFromStorage', () => {
    it('should load and set tables from AsyncStorage', async () => {
      const mockData = {
        tasks: { 'task1': { id: 'task1', title: 'Test Task' } },
        users: { 'user1': { id: 'user1', name: 'Test User' } },
      };

      vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(mockData));

      await persistenceManager.loadFromStorage();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('tinybase_data');
      expect(mockStore.setTables).toHaveBeenCalledWith(mockData);
    });

    it('should handle null data from AsyncStorage', async () => {
      vi.mocked(AsyncStorage.getItem).mockResolvedValue(null);

      await persistenceManager.loadFromStorage();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('tinybase_data');
      expect(mockStore.setTables).not.toHaveBeenCalled();
    });

    it('should handle load errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(AsyncStorage.getItem).mockRejectedValue(new Error('Load error'));

      await persistenceManager.loadFromStorage();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load data from storage:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should handle invalid JSON data', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(AsyncStorage.getItem).mockResolvedValue('invalid json');

      await persistenceManager.loadFromStorage();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load data from storage:', expect.any(Error));
      expect(mockStore.setTables).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('clearStorage', () => {
    it('should remove data from AsyncStorage', async () => {
      vi.mocked(AsyncStorage.removeItem).mockResolvedValue();

      await persistenceManager.clearStorage();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('tinybase_data');
    });

    it('should handle clear errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(AsyncStorage.removeItem).mockRejectedValue(new Error('Clear error'));

      await persistenceManager.clearStorage();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to clear storage:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('enableAutoSave', () => {
    it('should add tables listener for auto-save', () => {
      const mockListenerId = 'listener-123';
      mockStore.addTablesListener.mockReturnValue(mockListenerId);

      persistenceManager.enableAutoSave(500);

      expect(mockStore.addTablesListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should use default delay if not specified', () => {
      mockStore.addTablesListener.mockReturnValue('listener-123');

      persistenceManager.enableAutoSave();

      expect(mockStore.addTablesListener).toHaveBeenCalled();
    });
  });

  describe('exportData', () => {
    it('should return formatted JSON string of tables', async () => {
      const mockTables = {
        tasks: { 'task1': { id: 'task1', title: 'Test' } },
        users: { 'user1': { id: 'user1', name: 'Test' } },
      };

      mockStore.getTables.mockReturnValue(mockTables);

      const result = await persistenceManager.exportData();

      expect(result).toBe(JSON.stringify(mockTables, null, 2));
    });
  });

  describe('importData', () => {
    it('should import valid JSON data and save to storage', async () => {
      const mockData = {
        tasks: { 'task1': { id: 'task1', title: 'Imported Task' } },
      };
      const jsonData = JSON.stringify(mockData);

      // Mock getTables to return the imported data when saveToStorage is called
      mockStore.getTables.mockReturnValue(mockData);
      vi.mocked(AsyncStorage.setItem).mockResolvedValue();

      const result = await persistenceManager.importData(jsonData);

      expect(result).toBe(true);
      expect(mockStore.setTables).toHaveBeenCalledWith(mockData);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'tinybase_data',
        JSON.stringify(mockData)
      );
    });

    it('should return false for invalid JSON data', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = await persistenceManager.importData('invalid json');

      expect(result).toBe(false);
      expect(mockStore.setTables).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to import data:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should handle import errors and return false', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const mockData = { tasks: {} };
      const jsonData = JSON.stringify(mockData);
      
      mockStore.setTables.mockImplementation(() => {
        throw new Error('Set tables error');
      });

      const result = await persistenceManager.importData(jsonData);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to import data:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });
});