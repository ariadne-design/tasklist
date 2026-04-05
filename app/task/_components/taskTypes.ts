export type TaskStatus = 'todo' | 'inprogress' | 'done';
export interface TaskType {
  id: number;
  title: string;
  description: string;
  createTime: string;
  status: TaskStatus;
}
