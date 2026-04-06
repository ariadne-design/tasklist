import { ColumnTasks, TaskStatus, TaskType } from '@/types/taskType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
});

export const { addTask, updateTask, moveTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer;
