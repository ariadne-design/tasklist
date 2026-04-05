export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface TaskType {
  id: string;
  title: string;
  description: string;
  createTime: string;
  status: TaskStatus;
}

export type ColumnTasks = Record<TaskStatus, TaskType[]>;
