export interface User {
  id: string;
  name: string | null;
  email: string;
  role?: string;
  avatarUrl?: string | null;
}

export interface Team {
  id: number;
  name: string;
  description?: string | null;
  memberCount?: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  status: string;
  priority?: string;
  dueDate?: string | null;
  teamId?: number | null;
  progress?: number;
  owner?: string;
  tags?: string[];
}

export interface Task {
  id: number;
  title: string;
  status: string;
  priority?: string;
  projectId: number;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface DashboardStat {
  label: string;
  value: string;
  helperText: string;
}
