'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalOpen } from '@/store/modalSlice';
import { addTask, moveTask, updateTask } from '@/store/taskSlice';
import { ColumnTasks, TaskStatus, TaskType } from '@/types/taskType';
import { PlusOutlined } from '@ant-design/icons';
import { move } from '@dnd-kit/helpers';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { Button } from 'antd';
import { useState } from 'react';
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
  const { open, mode, editTask } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.task.tasks);
  const columns = [
    { id: 'column-todo', title: 'Todo' },
    {
      id: 'column-inprogress',
      title: 'InProgress',
    },
    { id: 'column-done', title: 'Done' },
  ];

  function handleDragEnd(event: any) {
    const { source, target } = event.operation;
    if (!target) return;

    // dispatch(moveTask({ id: source.id, status: target.id }));
    // setDragOverlayId(null);
  }
  function handleDragOver(event: any) {
    let newArr = move(tasks, event);
    dispatch(moveTask(newArr));
  }
  function handleDragStart(event: any) {
    const { source } = event.operation;
    console.log(source, 'source');
    setDragOverlayId(source.id);
  }
  return (
    <div className="flex flex-col gap-4">
      <TaskModal
        mode={mode}
        open={open}
        editTask={editTask}
        onClose={() => {
          dispatch(setModalOpen(false));
        }}
        onConfirm={(values) => {
          if (mode === 'edit') {
            dispatch(
              updateTask({
                ...(values as unknown as TaskType),
                id: editTask?.id as string,
              }),
            );
          } else {
            dispatch(addTask({ ...values }));
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
            {dragOverlayId &&
              (() => {
                const found = findTaskInColumns(tasks, dragOverlayId);
                if (!found) return null;
                const { task, column, index } = found;
                return (
                  <TaskCard
                    {...task}
                    status={task.status}
                    column={column}
                    index={index}
                  />
                );
              })()}
          </DragOverlay>
        </DragDropProvider>
      </div>
    </div>
  );
}
