export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleNames: string[];
  createdOn: Date;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: number;
}

export interface UpdateUserRoleRequest {
  roleId: number;
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

export interface Role {
  id: number;
  name: string;
}
