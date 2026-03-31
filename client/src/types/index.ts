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
  type?: string;
  ticket?: string;
  assigneeIds?: string[];
  createdById?: string;
  description?: string;
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
}

export interface DashboardStat {
  label: string;
  value: string;
  helperText: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  sizeLabel: string;
  addedById: string;
  addedAt: string;
}

export interface TaskComment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}
