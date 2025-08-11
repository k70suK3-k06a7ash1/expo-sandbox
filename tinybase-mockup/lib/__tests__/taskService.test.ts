import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskService } from '../taskService';
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
    generateId: vi.fn(() => 'mock-id-123'),
  };
});

describe('TaskService', () => {
  const mockStore = getStore();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task with generated ID and timestamps', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
      };

      const result = TaskService.createTask(taskData);

      expect(result).toEqual({
        ...taskData,
        id: 'mock-id-123',
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      });

      expect(mockStore.setRow).toHaveBeenCalledWith('tasks', 'mock-id-123', result);
    });

    it('should create task with proper timestamps', () => {
      const before = Date.now();
      const result = TaskService.createTask({
        title: 'Test',
        description: 'Test',
        completed: false,
      });
      const after = Date.now();

      expect(result.createdAt).toBeGreaterThanOrEqual(before);
      expect(result.createdAt).toBeLessThanOrEqual(after);
      expect(result.updatedAt).toBe(result.createdAt);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks from store', () => {
      const mockTasks = {
        'task1': { id: 'task1', title: 'Task 1', completed: false },
        'task2': { id: 'task2', title: 'Task 2', completed: true },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockTasks);

      const result = TaskService.getAllTasks();

      expect(mockStore.getTable).toHaveBeenCalledWith('tasks');
      expect(result).toEqual(Object.values(mockTasks));
    });

    it('should return empty array when no tasks exist', () => {
      vi.mocked(mockStore.getTable).mockReturnValue({});

      const result = TaskService.getAllTasks();

      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('should return task when found', () => {
      const mockTask = { id: 'task1', title: 'Test Task' };
      vi.mocked(mockStore.getRow).mockReturnValue(mockTask);

      const result = TaskService.getTaskById('task1');

      expect(mockStore.getRow).toHaveBeenCalledWith('tasks', 'task1');
      expect(result).toBe(mockTask);
    });

    it('should return undefined when task not found', () => {
      vi.mocked(mockStore.getRow).mockReturnValue({});

      const result = TaskService.getTaskById('nonexistent');

      expect(result).toBeUndefined();
    });
  });

  describe('getTasksByStatus', () => {
    it('should filter tasks by completed status', () => {
      const mockTasks = {
        'task1': { id: 'task1', title: 'Task 1', completed: false },
        'task2': { id: 'task2', title: 'Task 2', completed: true },
        'task3': { id: 'task3', title: 'Task 3', completed: false },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockTasks);

      const completedTasks = TaskService.getTasksByStatus(true);
      const activeTasks = TaskService.getTasksByStatus(false);

      expect(completedTasks).toHaveLength(1);
      expect(completedTasks[0].id).toBe('task2');
      expect(activeTasks).toHaveLength(2);
      expect(activeTasks.map(t => t.id)).toEqual(['task1', 'task3']);
    });
  });

  describe('searchTasks', () => {
    it('should search tasks by title and description', () => {
      const mockTasks = {
        'task1': { id: 'task1', title: 'Important Task', description: 'Do something' },
        'task2': { id: 'task2', title: 'Regular Task', description: 'Important work' },
        'task3': { id: 'task3', title: 'Other Task', description: 'Random stuff' },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockTasks);

      const results = TaskService.searchTasks('important');

      expect(results).toHaveLength(2);
      expect(results.map(t => t.id)).toEqual(['task1', 'task2']);
    });

    it('should be case insensitive', () => {
      const mockTasks = {
        'task1': { id: 'task1', title: 'IMPORTANT Task', description: 'test' },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockTasks);

      const results = TaskService.searchTasks('important');

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('task1');
    });
  });

  describe('updateTask', () => {
    it('should update existing task', () => {
      const existingTask = {
        id: 'task1',
        title: 'Old Title',
        description: 'Old Description',
        completed: false,
        createdAt: 1000000,
        updatedAt: 1000000,
      };

      vi.mocked(mockStore.getRow).mockReturnValue(existingTask);

      const updates = { title: 'New Title', completed: true };
      const result = TaskService.updateTask('task1', updates);

      expect(result).toEqual({
        ...existingTask,
        ...updates,
        updatedAt: expect.any(Number),
      });

      expect(mockStore.setRow).toHaveBeenCalledWith('tasks', 'task1', result);
    });

    it('should return null if task does not exist', () => {
      vi.mocked(mockStore.getRow).mockReturnValue({});

      const result = TaskService.updateTask('nonexistent', { title: 'New Title' });

      expect(result).toBeNull();
      expect(mockStore.setRow).not.toHaveBeenCalled();
    });
  });

  describe('toggleTaskCompletion', () => {
    it('should toggle task completion status', () => {
      const mockTask = {
        id: 'task1',
        title: 'Test Task',
        description: 'Test',
        completed: false,
        createdAt: 1000000,
        updatedAt: 1000000,
      };

      vi.mocked(mockStore.getRow).mockReturnValue(mockTask);

      const result = TaskService.toggleTaskCompletion('task1');

      expect(result?.completed).toBe(true);
      expect(mockStore.setRow).toHaveBeenCalled();
    });

    it('should return null if task does not exist', () => {
      vi.mocked(mockStore.getRow).mockReturnValue({});

      const result = TaskService.toggleTaskCompletion('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete existing task', () => {
      const mockTask = { id: 'task1', title: 'Test Task' };
      vi.mocked(mockStore.getRow).mockReturnValue(mockTask);

      const result = TaskService.deleteTask('task1');

      expect(result).toBe(true);
      expect(mockStore.delRow).toHaveBeenCalledWith('tasks', 'task1');
    });

    it('should return false if task does not exist', () => {
      vi.mocked(mockStore.getRow).mockReturnValue({});

      const result = TaskService.deleteTask('nonexistent');

      expect(result).toBe(false);
      expect(mockStore.delRow).not.toHaveBeenCalled();
    });
  });

  describe('deleteAllCompletedTasks', () => {
    it('should delete all completed tasks', () => {
      const mockTasks = {
        'task1': { id: 'task1', completed: false },
        'task2': { id: 'task2', completed: true },
        'task3': { id: 'task3', completed: true },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockTasks);
      vi.mocked(mockStore.getRow)
        .mockReturnValueOnce(mockTasks.task2)
        .mockReturnValueOnce(mockTasks.task3);

      const result = TaskService.deleteAllCompletedTasks();

      expect(result).toBe(2);
      expect(mockStore.delRow).toHaveBeenCalledTimes(2);
      expect(mockStore.delRow).toHaveBeenCalledWith('tasks', 'task2');
      expect(mockStore.delRow).toHaveBeenCalledWith('tasks', 'task3');
    });

    it('should return 0 if no completed tasks exist', () => {
      const mockTasks = {
        'task1': { id: 'task1', completed: false },
      };

      vi.mocked(mockStore.getTable).mockReturnValue(mockTasks);

      const result = TaskService.deleteAllCompletedTasks();

      expect(result).toBe(0);
      expect(mockStore.delRow).not.toHaveBeenCalled();
    });
  });

  describe('batch operations', () => {
    it('should create multiple tasks', () => {
      const tasksData = [
        { title: 'Task 1', description: 'Desc 1', completed: false },
        { title: 'Task 2', description: 'Desc 2', completed: true },
      ];

      const results = TaskService.createMultipleTasks(tasksData);

      expect(results).toHaveLength(2);
      expect(mockStore.setRow).toHaveBeenCalledTimes(2);
    });

    it('should update multiple tasks', () => {
      const mockTask1 = { id: 'task1', title: 'Old 1', completed: false, createdAt: 1000, updatedAt: 1000 };
      const mockTask2 = { id: 'task2', title: 'Old 2', completed: false, createdAt: 1000, updatedAt: 1000 };

      vi.mocked(mockStore.getRow)
        .mockReturnValueOnce(mockTask1)
        .mockReturnValueOnce(mockTask2);

      const updates = [
        { id: 'task1', data: { title: 'New 1' } },
        { id: 'task2', data: { title: 'New 2' } },
      ];

      const results = TaskService.updateMultipleTasks(updates);

      expect(results).toHaveLength(2);
      expect(results[0]?.title).toBe('New 1');
      expect(results[1]?.title).toBe('New 2');
    });
  });
});