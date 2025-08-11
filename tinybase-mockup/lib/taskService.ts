import { getStore, Task, generateId } from './store';

export class TaskService {
  private static getStoreInstance() {
    return getStore();
  }
  // CREATE
  static createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const id = generateId();
    const now = Date.now();
    
    const task: Task = {
      ...taskData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    TaskService.getStoreInstance().setRow('tasks', id, task);
    return task;
  }
  
  // READ
  static getAllTasks(): Task[] {
    const tasksTable = TaskService.getStoreInstance().getTable('tasks');
    return Object.values(tasksTable) as Task[];
  }
  
  static getTaskById(id: string): Task | undefined {
    const task = TaskService.getStoreInstance().getRow('tasks', id);
    return task ? (task as Task) : undefined;
  }
  
  static getTasksByStatus(completed: boolean): Task[] {
    return TaskService.getAllTasks().filter(task => task.completed === completed);
  }
  
  static searchTasks(query: string): Task[] {
    const allTasks = TaskService.getAllTasks();
    const lowercaseQuery = query.toLowerCase();
    
    return allTasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  // UPDATE
  static updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const existingTask = TaskService.getTaskById(id);
    if (!existingTask) {
      return null;
    }
    
    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: Date.now(),
    };
    
    TaskService.getStoreInstance().setRow('tasks', id, updatedTask);
    return updatedTask;
  }
  
  static toggleTaskCompletion(id: string): Task | null {
    const task = TaskService.getTaskById(id);
    if (!task) {
      return null;
    }
    
    return TaskService.updateTask(id, { completed: !task.completed });
  }
  
  // DELETE
  static deleteTask(id: string): boolean {
    const task = TaskService.getTaskById(id);
    if (!task) {
      return false;
    }
    
    TaskService.getStoreInstance().delRow('tasks', id);
    return true;
  }
  
  static deleteAllCompletedTasks(): number {
    const completedTasks = TaskService.getTasksByStatus(true);
    let deletedCount = 0;
    
    completedTasks.forEach(task => {
      if (TaskService.deleteTask(task.id)) {
        deletedCount++;
      }
    });
    
    return deletedCount;
  }
  
  // BATCH OPERATIONS
  static createMultipleTasks(tasksData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[]): Task[] {
    return tasksData.map(taskData => TaskService.createTask(taskData));
  }
  
  static updateMultipleTasks(updates: { id: string; data: Partial<Omit<Task, 'id' | 'createdAt'>> }[]): Task[] {
    return updates
      .map(({ id, data }) => TaskService.updateTask(id, data))
      .filter((task): task is Task => task !== null);
  }
}