'use client';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalOpen } from '@/store/modalSlice';
import { moveTask, updateTask } from '@/store/taskSlice';
import {
  createTaskAsync,
  getTasksAsync,
  updateTasksAsync,
} from '@/store/taskThunk';
import { ColumnTasks, TaskStatus, TaskType } from '@/types/taskType';
import { PlusOutlined } from '@ant-design/icons';
import { move } from '@dnd-kit/helpers';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import TaskModal from './TaskModal';
import ColumnCmp from './columns';
import TaskCard from './taskCard';

const TASK_STATUSES: TaskStatus[] = [
  'column-todo',
  'column-inprogress',
  'column-done',
];

function findTaskInColumns(
  columnTasks: ColumnTasks,
  taskId: string,
): { task: TaskType; column: TaskStatus; index: number } | null {
  for (const col of TASK_STATUSES) {
    const index = columnTasks[col].findIndex((t) => t.id === taskId);
    if (index !== -1) {
      return { task: columnTasks[col][index], column: col, index };
    }
  }
  return null;
}

export default function Kanbanboard() {
  const [dragOverlayId, setDragOverlayId] = useState<string | null>(null);
  const tasksSnapshotRef = useRef<ColumnTasks | null>(null);
  const { open, mode, editTask } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.task.tasks);
  useEffect(() => {
    dispatch(getTasksAsync());
  }, [dispatch]);

  const columns = [
    { id: 'column-todo', title: 'Todo' },
    {
      id: 'column-inprogress',
      title: 'InProgress',
    },
    { id: 'column-done', title: 'Done' },
  ];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  function handleDragStart(e: any) {
    tasksSnapshotRef.current = store.getState().task.tasks;
    const id = e.operation.source?.id;
    setDragOverlayId(id != null ? String(id) : null);
  }
  function handleDragOver(e: any) {
    const next = move(tasks, e);
    if (next !== tasks) dispatch(moveTask(next));
  }
  function handleDragEnd(e: any) {
    setDragOverlayId(null);
    //为了解决拖拽动画与 React 协调冲突导致 removeChild 报错
    const snap = tasksSnapshotRef.current;
    tasksSnapshotRef.current = null;
    if (e.canceled || !e.operation.target) {
      if (snap) dispatch(moveTask(snap));
      return;
    }
    dispatch(updateTasksAsync(move(tasks, e)));
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return (
    <div className="flex flex-col gap-4">
      <TaskModal
        mode={mode}
        open={open}
        editTask={editTask}
        onClose={() => {
          dispatch(setModalOpen(false));
        }}
        onConfirm={async (values) => {
          if (mode === 'edit') {
            dispatch(
              updateTask({
                ...(values as unknown as TaskType),
                id: editTask?.id as string,
              }),
            );
          } else {
            await dispatch(createTaskAsync({ ...values })).unwrap();
            await dispatch(getTasksAsync());
          }
          dispatch(setModalOpen(false));
        }}
      />
      <Button
        icon={<PlusOutlined />}
        className="ml-2 w-fit mt-4"
        onClick={() => dispatch(setModalOpen(true))}
      >
        Add Task
      </Button>
      <div className=" grid grid-cols-3 gap-4 h-full p-8">
        <DragDropProvider
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
        >
          {columns.map((column, columnIndex) => (
            <ColumnCmp
              key={column.id}
              index={columnIndex}
              id={column.id as TaskStatus}
              title={column.title}
            >
              {tasks[column.id as TaskStatus]}
            </ColumnCmp>
          ))}
          <DragOverlay>
            {dragOverlayId
              ? () => {
                  const found = findTaskInColumns(tasks, dragOverlayId);
                  if (!found) return null;
                  const { task, column, index } = found;
                  return (
                    <TaskCard
                      {...task}
                      status={task.status}
                      column={column}
                      index={index}
                      dragOverlay
                    />
                  );
                }
              : null}
          </DragOverlay>
        </DragDropProvider>
      </div>
    </div>
  );
}
