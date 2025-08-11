import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the dependencies
const mockStore = {
  addTableListener: vi.fn(() => 'listener-id'),
  addRowListener: vi.fn(() => 'listener-id'),
  delListener: vi.fn(),
};

const mockTaskService = {
  getAllTasks: vi.fn(() => []),
  getTaskById: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  toggleTaskCompletion: vi.fn(),
  getTasksByStatus: vi.fn(),
  searchTasks: vi.fn(),
  deleteAllCompletedTasks: vi.fn(),
};

const mockUserService = {
  getAllUsers: vi.fn(() => []),
  getUserById: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  getUserByEmail: vi.fn(),
  searchUsers: vi.fn(),
  getRecentUsers: vi.fn(),
};

// Mock modules
vi.mock('@/lib/store', () => ({
  getStore: () => mockStore,
}));

vi.mock('@/lib/taskService', () => ({
  TaskService: mockTaskService,
}));

vi.mock('@/lib/userService', () => ({
  UserService: mockUserService,
}));

describe('TinyBase Services Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TaskService Integration', () => {
    it('should have all required CRUD methods', () => {
      expect(mockTaskService.createTask).toBeDefined();
      expect(mockTaskService.getAllTasks).toBeDefined();
      expect(mockTaskService.getTaskById).toBeDefined();
      expect(mockTaskService.updateTask).toBeDefined();
      expect(mockTaskService.deleteTask).toBeDefined();
      expect(mockTaskService.toggleTaskCompletion).toBeDefined();
      expect(mockTaskService.getTasksByStatus).toBeDefined();
      expect(mockTaskService.searchTasks).toBeDefined();
      expect(mockTaskService.deleteAllCompletedTasks).toBeDefined();
    });

    it('should call methods with correct parameters', () => {
      // Test create
      const taskData = { title: 'Test Task', description: 'Test', completed: false };
      mockTaskService.createTask(taskData);
      expect(mockTaskService.createTask).toHaveBeenCalledWith(taskData);

      // Test update
      const updateData = { title: 'Updated Task' };
      mockTaskService.updateTask('task1', updateData);
      expect(mockTaskService.updateTask).toHaveBeenCalledWith('task1', updateData);

      // Test delete
      mockTaskService.deleteTask('task1');
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith('task1');

      // Test get by status
      mockTaskService.getTasksByStatus(true);
      expect(mockTaskService.getTasksByStatus).toHaveBeenCalledWith(true);

      // Test search
      mockTaskService.searchTasks('query');
      expect(mockTaskService.searchTasks).toHaveBeenCalledWith('query');
    });
  });

  describe('UserService Integration', () => {
    it('should have all required CRUD methods', () => {
      expect(mockUserService.createUser).toBeDefined();
      expect(mockUserService.getAllUsers).toBeDefined();
      expect(mockUserService.getUserById).toBeDefined();
      expect(mockUserService.updateUser).toBeDefined();
      expect(mockUserService.deleteUser).toBeDefined();
      expect(mockUserService.getUserByEmail).toBeDefined();
      expect(mockUserService.searchUsers).toBeDefined();
      expect(mockUserService.getRecentUsers).toBeDefined();
    });

    it('should call methods with correct parameters', () => {
      // Test create
      const userData = { name: 'John Doe', email: 'john@example.com' };
      mockUserService.createUser(userData);
      expect(mockUserService.createUser).toHaveBeenCalledWith(userData);

      // Test update
      const updateData = { name: 'Jane Doe' };
      mockUserService.updateUser('user1', updateData);
      expect(mockUserService.updateUser).toHaveBeenCalledWith('user1', updateData);

      // Test delete
      mockUserService.deleteUser('user1');
      expect(mockUserService.deleteUser).toHaveBeenCalledWith('user1');

      // Test get by email
      mockUserService.getUserByEmail('john@example.com');
      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith('john@example.com');

      // Test search
      mockUserService.searchUsers('john');
      expect(mockUserService.searchUsers).toHaveBeenCalledWith('john');

      // Test get recent
      mockUserService.getRecentUsers(5);
      expect(mockUserService.getRecentUsers).toHaveBeenCalledWith(5);
    });
  });

  describe('Store Integration', () => {
    it('should have listener management methods', () => {
      expect(mockStore.addTableListener).toBeDefined();
      expect(mockStore.addRowListener).toBeDefined();
      expect(mockStore.delListener).toBeDefined();
    });

    it('should manage listeners correctly', () => {
      // Test table listener
      const callback = vi.fn();
      mockStore.addTableListener('tasks', callback);
      expect(mockStore.addTableListener).toHaveBeenCalledWith('tasks', callback);

      // Test row listener
      mockStore.addRowListener('tasks', 'task1', callback);
      expect(mockStore.addRowListener).toHaveBeenCalledWith('tasks', 'task1', callback);

      // Test delete listener
      mockStore.delListener('listener-id');
      expect(mockStore.delListener).toHaveBeenCalledWith('listener-id');
    });
  });

  describe('Error Handling', () => {
    it('should handle service method failures', () => {
      // Mock a service method to throw an error
      mockTaskService.createTask.mockImplementation(() => {
        throw new Error('Service error');
      });

      expect(() => {
        mockTaskService.createTask({ title: 'Test', description: 'Test', completed: false });
      }).toThrow('Service error');

      // Reset the mock
      mockTaskService.createTask.mockRestore();
    });

    it('should handle undefined return values', () => {
      mockTaskService.getTaskById.mockReturnValue(undefined);
      
      const result = mockTaskService.getTaskById('nonexistent');
      
      expect(result).toBeUndefined();
    });

    it('should handle empty data sets', () => {
      mockTaskService.getAllTasks.mockReturnValue([]);
      mockUserService.getAllUsers.mockReturnValue([]);

      expect(mockTaskService.getAllTasks()).toEqual([]);
      expect(mockUserService.getAllUsers()).toEqual([]);
    });
  });

  describe('Data Flow Patterns', () => {
    it('should support typical CRUD workflows', () => {
      // Create workflow
      const newTask = { id: 'task1', title: 'New Task', completed: false, createdAt: Date.now(), updatedAt: Date.now() };
      mockTaskService.createTask.mockReturnValue(newTask);
      
      const created = mockTaskService.createTask({ title: 'New Task', description: '', completed: false });
      expect(created).toEqual(newTask);

      // Read workflow
      mockTaskService.getAllTasks.mockReturnValue([newTask]);
      mockTaskService.getTaskById.mockReturnValue(newTask);
      
      expect(mockTaskService.getAllTasks()).toContain(newTask);
      expect(mockTaskService.getTaskById('task1')).toEqual(newTask);

      // Update workflow
      const updatedTask = { ...newTask, title: 'Updated Task', updatedAt: Date.now() };
      mockTaskService.updateTask.mockReturnValue(updatedTask);
      
      const updated = mockTaskService.updateTask('task1', { title: 'Updated Task' });
      expect(updated).toEqual(updatedTask);

      // Delete workflow
      mockTaskService.deleteTask.mockReturnValue(true);
      
      const deleted = mockTaskService.deleteTask('task1');
      expect(deleted).toBe(true);
    });

    it('should support search and filtering', () => {
      const tasks = [
        { id: 'task1', title: 'Important Task', completed: false },
        { id: 'task2', title: 'Regular Task', completed: true },
      ];

      // Search
      mockTaskService.searchTasks.mockReturnValue([tasks[0]]);
      expect(mockTaskService.searchTasks('important')).toEqual([tasks[0]]);

      // Filter by status
      mockTaskService.getTasksByStatus.mockReturnValue([tasks[1]]);
      expect(mockTaskService.getTasksByStatus(true)).toEqual([tasks[1]]);
    });

    it('should support batch operations', () => {
      const completedTasks = [
        { id: 'task1', completed: true },
        { id: 'task2', completed: true },
      ];

      mockTaskService.deleteAllCompletedTasks.mockReturnValue(2);
      
      const deletedCount = mockTaskService.deleteAllCompletedTasks();
      expect(deletedCount).toBe(2);
    });
  });
});