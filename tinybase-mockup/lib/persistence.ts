import AsyncStorage from '@react-native-async-storage/async-storage';
import { Store } from 'tinybase';

const STORAGE_KEY = 'tinybase_data';

export class PersistenceManager {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  async saveToStorage(): Promise<void> {
    try {
      const tables = this.store.getTables();
      const dataString = JSON.stringify(tables);
      await AsyncStorage.setItem(STORAGE_KEY, dataString);
    } catch (error) {
      console.error('Failed to save data to storage:', error);
    }
  }

  async loadFromStorage(): Promise<void> {
    try {
      const dataString = await AsyncStorage.getItem(STORAGE_KEY);
      if (dataString) {
        const tables = JSON.parse(dataString);
        this.store.setTables(tables);
      }
    } catch (error) {
      console.error('Failed to load data from storage:', error);
    }
  }

  async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  enableAutoSave(delayMs: number = 1000): void {
    let saveTimeout: NodeJS.Timeout | null = null;

    const debouncedSave = () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      saveTimeout = setTimeout(() => {
        this.saveToStorage();
      }, delayMs);
    };

    this.store.addTablesListener(debouncedSave);
  }

  async exportData(): Promise<string> {
    const tables = this.store.getTables();
    return JSON.stringify(tables, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const tables = JSON.parse(jsonData);
      this.store.setTables(tables);
      await this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}