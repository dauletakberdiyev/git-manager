import api from './client';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  branchName: string | null;
  createdAt: string;
}

export const createTask = (dto: {
  projectId: string;
  title: string;
}): Promise<Task> => api.post('/tasks', dto).then((r) => r.data);

export const updateTask = (
  id: string,
  dto: { status?: TaskStatus },
): Promise<Task> => api.patch(`/tasks/${id}`, dto).then((r) => r.data);

export const createTasks = (dto: {
  projectId: string;
  titles: string[];
}): Promise<Task[]> => api.post('/tasks/bulk', dto).then((r) => r.data);
