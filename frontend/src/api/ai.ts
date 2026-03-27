import api from './client';

export const breakdownTask = (taskTitle: string): Promise<string[]> =>
  api.post('/ai/breakdown', { taskTitle }).then((r) => r.data);
