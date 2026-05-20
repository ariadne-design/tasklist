'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalOpen } from '@/store/modalSlice';
import { moveTask, Searchtask, updateTask } from '@/store/taskSlice';
import type { ColumnTasksPatch } from '@/store/taskThunk';
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

/** 与拖拽前快照对比，只返回顺序或成员有变化的列（同列排序 / 跨列各算变更列） */
function getChangedColumnsOnly(
  before: ColumnTasks,
  after: ColumnTasks,
): ColumnTasksPatch | null {
  const partial: Partial<ColumnTasks> = {};
  for (const col of TASK_STATUSES) {
    const b = before[col];
    const a = after[col];
    const same = b.length === a.length && b.every((t, i) => t.id === a[i].id);
    if (!same) {
      partial[col] = a;
    }
  }
  const keys = Object.keys(partial) as TaskStatus[];
  return keys.length > 0 ? partial : null;
}

export default function Kanbanboard() {
  const [dragOverlayId, setDragOverlayId] = useState<string | null>(null);
  /** 拖拽过程中的列数据，不写 Redux，避免高频 dispatch */
  const [dragTasks, setDragTasks] = useState<ColumnTasks | null>(null);
  const dragTasksRef = useRef<ColumnTasks | null>(null);
  const tasksSnapshotRef = useRef<ColumnTasks | null>(null);
  const { open, mode, editTask } = useAppSelector((state) => state.modal);
  const [search, setSearch] = useState('');
  const dispatch = useAppDispatch();
  const reduxTasks = useAppSelector((state) => state.task.tasks);
  const displayTasks = dragTasks ?? reduxTasks;

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
    tasksSnapshotRef.current = reduxTasks;
    dragTasksRef.current = reduxTasks;
    setDragTasks(reduxTasks);
    const id = e.operation.source?.id;
    setDragOverlayId(id != null ? String(id) : null);
  }
  function handleDragOver(e: any) {
    const current = dragTasksRef.current;
    if (!current) return;
    const next = move(current, e);
    if (next === current) return;
    dragTasksRef.current = next;
    setDragTasks(next);
  }
  function handleDragEnd(e: any) {
    setDragOverlayId(null);
    const snap = tasksSnapshotRef.current;
    tasksSnapshotRef.current = null;
    const current = dragTasksRef.current;
    dragTasksRef.current = null;
    setDragTasks(null);

    if (e.canceled || !e.operation.target) {
      return;
    }
    const next = current ? move(current, e) : move(reduxTasks, e);
    const baseline = snap ?? reduxTasks;
    dispatch(moveTask(next));
    const patch = getChangedColumnsOnly(baseline, next);
    if (patch) {
      dispatch(updateTasksAsync(patch));
    }
  }

  useEffect(() => {
    if (search) {
      dispatch(Searchtask(search));
    }
  }, [search]);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return (
    <div className="flex flex-col gap-4">
      {/* <Input
        placeholder="Search"
        onChange={(e) => {
          if (!e.target.value) {
            dispatch(getTasksAsync());
          }
          setSearch(e.target.value);
        }}
      /> */}

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
      <div className=" flex flex-row justify-center items-center">
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
              {displayTasks[column.id as TaskStatus]}
            </ColumnCmp>
          ))}
          <DragOverlay>
            {dragOverlayId
              ? () => {
                  const found = findTaskInColumns(displayTasks, dragOverlayId);
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
