import { ColumnTasks, TaskType } from '@/types/taskType';
import { createAsyncThunk } from '@reduxjs/toolkit';

type acceptTaskType = Omit<TaskType, 'id' | 'createTime'>;
export const createTaskAsync = createAsyncThunk(
  'task/createTask',
  async (task: acceptTaskType) => {
    const response = await fetch('/api/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  },
);

export const getTasksAsync = createAsyncThunk('task/getTasks', async () => {
  const response = await fetch('/api/task');
  if (!response.ok) {
    throw new Error('Failed to get tasks');
  }
  return response.json();
});

export const updateTasksAsync = createAsyncThunk(
  'task/updateTasks',
  async (columns: ColumnTasks) => {
    const response = await fetch('/api/task', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ columns }),
    });
    if (!response.ok) {
      throw new Error('Failed to update tasks');
    }
    return response.json();
  },
);
