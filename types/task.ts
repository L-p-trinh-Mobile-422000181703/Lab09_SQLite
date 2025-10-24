export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority?: string;
  category?: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  greeting?: string;
}