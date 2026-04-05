import { TaskType } from '@/types/taskType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type Mode = 'create' | 'edit';
interface ModalState {
  mode: Mode;
  open: boolean;
  editTask?: TaskType;
}
const initialState: ModalState = {
  mode: 'create',
  open: false,
  editTask: undefined,
};
const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    setEditTask: (state, action: PayloadAction<TaskType>) => {
      state.mode = 'edit';
      state.editTask = action.payload;
    },
  },
});

export const { setModalOpen, setEditTask } = modalSlice.actions;
export default modalSlice.reducer;
