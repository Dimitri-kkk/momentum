// Types for API responses
export interface Employee {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: string; // Changed from enum to string to be more flexible with API
  dueDate: string; // ISO date string
  departmentName: string;
  assignee: Employee;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface TaskFormData {
  name: string;
  description: string;
  priority: string;
  dueDate: string;
  departmentName: string;
  assigneeId: string;
}

// Removed the hard-coded TaskPriority enum since it will come from the API 