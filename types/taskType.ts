export type TaskStatus = 'column-todo' | 'column-inprogress' | 'column-done';

export interface TaskType {
  id: string;
  title: string;
  status: TaskStatus;
  description: string;
  createTime: string;
}

export type ColumnTasks = Record<TaskStatus, TaskType[]>;
