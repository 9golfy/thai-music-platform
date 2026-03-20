// User Types and Interfaces

export type UserRole = 'root' | 'admin' | 'super_admin' | 'teacher';

export interface User {
  _id?: string;
  email: string;
  password: string; // hashed
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
  schoolId?: string; // For teachers only
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
  schoolId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  schoolId?: string; // Required for teacher login
}

export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  schoolId?: string;
}

export interface PasswordResetRequest {
  email: string;
  phone: string;
}
