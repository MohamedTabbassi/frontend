export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  SERVICE_USER = 'SERVICE_USER'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}