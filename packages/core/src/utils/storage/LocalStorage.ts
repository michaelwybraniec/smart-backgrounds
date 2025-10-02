/**
 * LocalStorage wrapper with error handling and type safety
 */

export class LocalStorage {
  private prefix: string;

  constructor(prefix = 'smart-bg-') {
    this.prefix = prefix;
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get item from localStorage
   */
  get<T = unknown>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Failed to get item "${key}" from localStorage:`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  set<T = unknown>(key: string, value: T): boolean {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to set item "${key}" in localStorage:`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error(`Failed to remove item "${key}" from localStorage:`, error);
      return false;
    }
  }

  /**
   * Clear all items with prefix
   */
  clear(): boolean {
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * Get all keys with prefix
   */
  keys(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter((key) => key.startsWith(this.prefix))
        .map((key) => key.slice(this.prefix.length));
    } catch (error) {
      console.error('Failed to get localStorage keys:', error);
      return [];
    }
  }

  /**
   * Get storage size in bytes
   */
  getSize(): number {
    try {
      let size = 0;
      for (const key in localStorage) {
        if (
          Object.prototype.hasOwnProperty.call(localStorage, key) &&
          key.startsWith(this.prefix)
        ) {
          const value = localStorage.getItem(key);
          size += key.length + (value?.length ?? 0);
        }
      }
      return size;
    } catch {
      return 0;
    }
  }
}
