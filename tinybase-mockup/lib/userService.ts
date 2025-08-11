import { getStore, User, generateId } from './store';

export class UserService {
  private static getStoreInstance() {
    return getStore();
  }
  // CREATE
  static createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const id = generateId();
    const now = Date.now();
    
    const user: User = {
      ...userData,
      id,
      createdAt: now,
    };
    
    UserService.getStoreInstance().setRow('users', id, user);
    return user;
  }
  
  // READ
  static getAllUsers(): User[] {
    const usersTable = UserService.getStoreInstance().getTable('users');
    return Object.values(usersTable) as User[];
  }
  
  static getUserById(id: string): User | undefined {
    const user = UserService.getStoreInstance().getRow('users', id);
    return user ? (user as User) : undefined;
  }
  
  static getUserByEmail(email: string): User | undefined {
    const allUsers = UserService.getAllUsers();
    return allUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  }
  
  static searchUsers(query: string): User[] {
    const allUsers = UserService.getAllUsers();
    const lowercaseQuery = query.toLowerCase();
    
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  // UPDATE
  static updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
    const existingUser = UserService.getUserById(id);
    if (!existingUser) {
      return null;
    }
    
    const updatedUser: User = {
      ...existingUser,
      ...updates,
    };
    
    UserService.getStoreInstance().setRow('users', id, updatedUser);
    return updatedUser;
  }
  
  // DELETE
  static deleteUser(id: string): boolean {
    const user = UserService.getUserById(id);
    if (!user) {
      return false;
    }
    
    UserService.getStoreInstance().delRow('users', id);
    return true;
  }
  
  // UTILITY
  static getUsersCount(): number {
    return UserService.getAllUsers().length;
  }
  
  static getRecentUsers(limit: number = 5): User[] {
    return UserService.getAllUsers()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }
}