import { useEffect, useState } from 'react';
import { getStore, Task, User } from '@/lib/store';
import { TaskService } from '@/lib/taskService';
import { UserService } from '@/lib/userService';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const store = getStore();
    
    // Initial load
    setTasks(TaskService.getAllTasks());
    setLoading(false);

    const listenerId = store.addTableListener('tasks', () => {
      setTasks(TaskService.getAllTasks());
    });

    return () => { store.delListener(listenerId); };
  }, []);

  return {
    tasks,
    loading,
    createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => TaskService.createTask(taskData),
    updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => TaskService.updateTask(id, updates),
    deleteTask: (id: string) => TaskService.deleteTask(id),
    toggleTaskCompletion: (id: string) => TaskService.toggleTaskCompletion(id),
    getTasksByStatus: (completed: boolean) => TaskService.getTasksByStatus(completed),
    searchTasks: (query: string) => TaskService.searchTasks(query),
    deleteAllCompletedTasks: () => TaskService.deleteAllCompletedTasks(),
  };
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const store = getStore();
    
    // Initial load
    setUsers(UserService.getAllUsers());
    setLoading(false);

    const listenerId = store.addTableListener('users', () => {
      setUsers(UserService.getAllUsers());
    });

    return () => { store.delListener(listenerId); };
  }, []);

  return {
    users,
    loading,
    createUser: (userData: Omit<User, 'id' | 'createdAt'>) => UserService.createUser(userData),
    updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => UserService.updateUser(id, updates),
    deleteUser: (id: string) => UserService.deleteUser(id),
    getUserByEmail: (email: string) => UserService.getUserByEmail(email),
    searchUsers: (query: string) => UserService.searchUsers(query),
    getRecentUsers: (limit?: number) => UserService.getRecentUsers(limit),
  };
};

export const useTask = (taskId: string) => {
  const [task, setTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    const store = getStore();
    
    // Initial load
    setTask(TaskService.getTaskById(taskId));

    const listenerId = store.addRowListener('tasks', taskId, () => {
      setTask(TaskService.getTaskById(taskId));
    });

    return () => { store.delListener(listenerId); };
  }, [taskId]);

  return task;
};

export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const store = getStore();
    
    // Initial load
    setUser(UserService.getUserById(userId));

    const listenerId = store.addRowListener('users', userId, () => {
      setUser(UserService.getUserById(userId));
    });

    return () => { store.delListener(listenerId); };
  }, [userId]);

  return user;
};