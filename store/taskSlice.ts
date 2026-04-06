import { ColumnTasks, TaskStatus, TaskType } from '@/types/taskType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createTaskAsync, getTasksAsync, updateTasksAsync } from './taskThunk';
type acceptTaskType = Omit<TaskType, 'id' | 'createTime'>;

const TASK_STATUSES: TaskStatus[] = [
  'column-todo',
  'column-inprogress',
  'column-done',
];
const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: {
      'column-todo': [],
      'column-inprogress': [],
      'column-done': [],
    } as ColumnTasks,
    loading: {
      create: false,
      get: false,
      update: false,
      delete: false,
    },
  },
  reducers: {
    addTask: (state, action: PayloadAction<acceptTaskType>) => {
      state.tasks[action.payload.status].push({
        id: `task-${Date.now().toString()}`,
        title: action.payload.title,
        description: action.payload.description,
        createTime: Date.now().toString(),
        status: action.payload.status,
      });
    },
    updateTask: (state, action: PayloadAction<TaskType>) => {
      const payload = action.payload;
      const { id } = payload;

      let fromColumn: TaskStatus | null = null;
      let index = -1;

      for (const col of TASK_STATUSES) {
        const i = state.tasks[col].findIndex((t) => t.id === id);
        if (i !== -1) {
          fromColumn = col;
          index = i;
          break;
        }
      }
      if (fromColumn === null || index === -1) return;

      const updated: TaskType = {
        ...state.tasks[fromColumn][index],
        ...payload,
      };
      if (updated.status === fromColumn) {
        state.tasks[fromColumn][index] = updated;
      } else {
        state.tasks[fromColumn].splice(index, 1);
        state.tasks[updated.status].push(updated);
      }
    },
    moveTask: (state, action: PayloadAction<ColumnTasks>) => {
      state.tasks = {
        ...state.tasks,
        ...action.payload,
      };
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      for (const col of TASK_STATUSES) {
        const i = state.tasks[col].findIndex((t) => t.id === id);
        if (i !== -1) {
          state.tasks[col].splice(i, 1);
          break;
        }
      }
      // const index = state.tasks[action.payload.status as TaskStatus].findIndex((task) => task.id === action.payload);
      // if (index !== -1) {
      //   state.tasks[action.payload.status as TaskStatus].splice(index, 1);
      // }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createTaskAsync.pending, (state, action) => {
      state.loading.create = true;
    });
    builder.addCase(createTaskAsync.fulfilled, (state, action) => {
      state.loading.create = false;
      // state.tasks = action.payload;
    });
    builder.addCase(createTaskAsync.rejected, (state, action) => {
      state.loading.create = false;
    });

    builder.addCase(getTasksAsync.pending, (state, action) => {
      state.loading.get = true;
    });
    builder.addCase(getTasksAsync.fulfilled, (state, action) => {
      state.loading.get = false;
      state.tasks = action.payload.data;
    });
    builder.addCase(getTasksAsync.rejected, (state, action) => {
      state.loading.get = false;
    });
    builder.addCase(updateTasksAsync.pending, (state, action) => {
      state.loading.update = true;
    });
    builder.addCase(updateTasksAsync.fulfilled, (state, action) => {
      state.loading.update = false;
      state.tasks = action.payload.data;
    });
    builder.addCase(updateTasksAsync.rejected, (state, action) => {
      state.loading.update = false;
    });
  },
});

export const { addTask, updateTask, moveTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
