import api from './client';

export interface Project {
  id: string;
  name: string;
  fullName: string;
  repoId: string;
  defaultBranch: string;
  createdAt: string;
}

export interface ImportableRepo {
  repoId: string;
  name: string;
  fullName: string;
  defaultBranch: string;
}

export const getProjects = (): Promise<Project[]> =>
  api.get('/projects').then((r) => r.data);

export const getImportableRepos = (): Promise<ImportableRepo[]> =>
  api.get('/projects/import').then((r) => r.data);

export const importProject = (dto: ImportableRepo): Promise<Project> =>
  api.post('/projects', dto).then((r) => r.data);

export const getProjectTasks = (id: string) =>
  api.get(`/projects/${id}/tasks`).then((r) => r.data);
