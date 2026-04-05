import { TaskStatus, TaskType } from '@/types/taskType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type acceptTaskType = Omit<TaskType, 'id' | 'createTime'>;
const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [] as TaskType[],
  },
  reducers: {
    addTask: (state, action: PayloadAction<acceptTaskType>) => {
      state.tasks.push({
        id: `task-${Date.now().toString()}`,
        title: action.payload.title,
        description: action.payload.description,
        createTime: Date.now().toString(),
        status: action.payload.status,
      });
    },
    updateTask: (state, action: PayloadAction<TaskType>) => {
      const { id, ...rest } = action.payload;
      const index = state.tasks.findIndex((task) => task.id === id);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...rest,
        };
      }
    },
    moveTask: (
      state,
      action: PayloadAction<{ id: string; status: TaskStatus }>,
    ) => {
      const { id, status } = action.payload;
      const index = state.tasks.findIndex((task) => task.id === id);
      if (index !== -1) {
        state.tasks[index].status = status;
      }
    },
  },
});

export const { addTask, updateTask, moveTask } = taskSlice.actions;
export default taskSlice.reducer;
