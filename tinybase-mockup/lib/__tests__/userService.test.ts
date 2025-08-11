import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '../userService';
import { getStore } from '../store';

// Mock the store module
vi.mock('../store', () => {
  const mockStore = {
    setRow: vi.fn(),
    getRow: vi.fn(),
    delRow: vi.fn(),
    getTable: vi.fn(() => ({})),
  };

  return {
    getStore: vi.fn(() => mockStore),
    generateId: vi.fn(() => 'mock-user-123'),
  };
});

describe('UserService', () => {
  const mockStore = getStore();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user with generated ID and timestamp', () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.png',
      };

      const result = UserService.createUser(userData);

      expect(result).toEqual({
        ...userData,
        id: 'mock-user-123',
        createdAt: expect.any(Number),
      });

      expect(mockStore.setRow).toHaveBeenCalledWith('users', 'mock-user-123', result);
    });

    it('should create user without avatar', () => {
      const userData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      const result = UserService.createUser(userData);

      expect(result.avatar).toBeUndefined();
      expect(result.name).toBe('Jane Smith');
      expect(result.email).toBe('jane@example.com');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users from store', () => {
      const mockUsers = {
        'user1': { id: 'user1', name: 'John', email: 'john@example.com' },
        'user2': { id: 'user2', name: 'Jane', email: 'jane@example.com' },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockUsers);

      const result = UserService.getAllUsers();

      expect(mockStore.getTable).toHaveBeenCalledWith('users');
      expect(result).toEqual(Object.values(mockUsers));
    });

    it('should return empty array when no users exist', () => {
      vi.mocked(mockStore.getTable).mockReturnValue({});

      const result = UserService.getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', () => {
      const mockUser = { id: 'user1', name: 'John Doe', email: 'john@example.com' };
      vi.mocked(mockStore.getRow).mockReturnValue(mockUser);

      const result = UserService.getUserById('user1');

      expect(mockStore.getRow).toHaveBeenCalledWith('users', 'user1');
      expect(result).toBe(mockUser);
    });

    it('should return undefined when user not found', () => {
      vi.mocked(mockStore.getRow).mockReturnValue(undefined);

      const result = UserService.getUserById('nonexistent');

      expect(result).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    it('should find user by email (case insensitive)', () => {
      const mockUsers = {
        'user1': { id: 'user1', name: 'John', email: 'john@example.com' },
        'user2': { id: 'user2', name: 'Jane', email: 'jane@example.com' },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockUsers);

      const result = UserService.getUserByEmail('JOHN@EXAMPLE.COM');

      expect(result?.id).toBe('user1');
    });

    it('should return undefined if user not found', () => {
      vi.mocked(mockStore.getTable).mockReturnValue({});

      const result = UserService.getUserByEmail('notfound@example.com');

      expect(result).toBeUndefined();
    });
  });

  describe('searchUsers', () => {
    it('should search users by name and email', () => {
      const mockUsers = {
        'user1': { id: 'user1', name: 'John Smith', email: 'john@example.com' },
        'user2': { id: 'user2', name: 'Jane Doe', email: 'jane@test.com' },
        'user3': { id: 'user3', name: 'Bob Johnson', email: 'bob@example.com' },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockUsers);

      const results = UserService.searchUsers('john');

      expect(results).toHaveLength(2); // John Smith and Bob Johnson
      expect(results.map(u => u.id)).toEqual(['user1', 'user3']);
    });

    it('should search by email', () => {
      const mockUsers = {
        'user1': { id: 'user1', name: 'John', email: 'john@example.com' },
        'user2': { id: 'user2', name: 'Jane', email: 'jane@test.com' },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockUsers);

      const results = UserService.searchUsers('example');

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('user1');
    });

    it('should be case insensitive', () => {
      const mockUsers = {
        'user1': { id: 'user1', name: 'JOHN DOE', email: 'john@example.com' },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockUsers);

      const results = UserService.searchUsers('john doe');

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('user1');
    });
  });

  describe('updateUser', () => {
    it('should update existing user', () => {
      const existingUser = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: 1000000,
      };

      vi.mocked(mockStore.getRow).mockReturnValue(existingUser);

      const updates = { name: 'John Smith', avatar: 'https://example.com/new-avatar.png' };
      const result = UserService.updateUser('user1', updates);

      expect(result).toEqual({
        ...existingUser,
        ...updates,
      });

      expect(mockStore.setRow).toHaveBeenCalledWith('users', 'user1', result);
    });

    it('should return null if user does not exist', () => {
      vi.mocked(mockStore.getRow).mockReturnValue(undefined);

      const result = UserService.updateUser('nonexistent', { name: 'New Name' });

      expect(result).toBeNull();
      expect(mockStore.setRow).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', () => {
      const mockUser = { id: 'user1', name: 'John Doe', email: 'john@example.com' };
      vi.mocked(mockStore.getRow).mockReturnValue(mockUser);

      const result = UserService.deleteUser('user1');

      expect(result).toBe(true);
      expect(mockStore.delRow).toHaveBeenCalledWith('users', 'user1');
    });

    it('should return false if user does not exist', () => {
      vi.mocked(mockStore.getRow).mockReturnValue(undefined);

      const result = UserService.deleteUser('nonexistent');

      expect(result).toBe(false);
      expect(mockStore.delRow).not.toHaveBeenCalled();
    });
  });

  describe('utility methods', () => {
    it('should return users count', () => {
      const mockUsers = {
        'user1': { id: 'user1', name: 'John' },
        'user2': { id: 'user2', name: 'Jane' },
        'user3': { id: 'user3', name: 'Bob' },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockUsers);

      const count = UserService.getUsersCount();

      expect(count).toBe(3);
    });

    it('should return recent users sorted by creation date', () => {
      const mockUsers = {
        'user1': { id: 'user1', name: 'John', createdAt: 1000000 },
        'user2': { id: 'user2', name: 'Jane', createdAt: 3000000 },
        'user3': { id: 'user3', name: 'Bob', createdAt: 2000000 },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockUsers);

      const recent = UserService.getRecentUsers(2);

      expect(recent).toHaveLength(2);
      expect(recent[0].id).toBe('user2'); // Most recent
      expect(recent[1].id).toBe('user3'); // Second most recent
    });

    it('should limit recent users to specified count', () => {
      const mockUsers = {
        'user1': { id: 'user1', name: 'John', createdAt: 1000000 },
        'user2': { id: 'user2', name: 'Jane', createdAt: 3000000 },
        'user3': { id: 'user3', name: 'Bob', createdAt: 2000000 },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockUsers);

      const recent = UserService.getRecentUsers(1);

      expect(recent).toHaveLength(1);
      expect(recent[0].id).toBe('user2');
    });

    it('should use default limit of 5 for recent users', () => {
      const mockUsers = Array.from({ length: 10 }, (_, i) => ({
        [`user${i}`]: { id: `user${i}`, name: `User ${i}`, createdAt: i * 1000000 }
      })).reduce((acc, user) => ({ ...acc, ...user }), {});

      vi.mocked(mockStore.getTable).mockReturnValue(mockUsers);

      const recent = UserService.getRecentUsers();

      expect(recent).toHaveLength(5);
    });
  });
});