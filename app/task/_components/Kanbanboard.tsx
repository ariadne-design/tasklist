'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setModalOpen } from '@/store/modalSlice';
import { addTask, moveTask, updateTask } from '@/store/taskSlice';
import { TaskStatus, TaskType } from '@/types/taskType';
import { PlusOutlined } from '@ant-design/icons';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { Button } from 'antd';
import { useState } from 'react';
import TaskModal from './TaskModal';
import ColumnCmp from './columns';
import TaskCard from './taskCard';

export default function Kanbanboard() {
  const [dragOverlayId, setDragOverlayId] = useState<string | null>(null);
  const { open, mode, editTask } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.task.tasks);
  const columns = [
    { id: 'column-todo', title: 'Todo', status: 'column-todo' },
    {
      id: 'column-inprogress',
      title: 'InProgress',
      status: 'column-inprogress',
    },
    { id: 'column-done', title: 'Done', status: 'column-done' },
  ];

  function handleDragEnd(event: any) {
    const { source, target } = event.operation;
    if (!target) return;
    console.log(source, target, '2222');

    dispatch(moveTask({ id: source.id, status: target.id }));
    setDragOverlayId(null);
  }
  function handleDragOver(event: any) {
    const { source, target } = event.operation;
    console.log(source, target);
    if (source && target) {
    }
  }
  function handleDragStart(event: any) {
    const { source } = event.operation;
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
                ...(values as TaskType),
                id: editTask?.id as string,
              }),
            );
          } else {
            dispatch(addTask(values));
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
      <div className="w-full flex flex-row justify-around gap-4 p-4 min-h-[300px] max-h-[800px] overflow-y-auto">
        <DragDropProvider
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
        >
          {columns.map((column, columnIndex) => (
            <ColumnCmp
              key={column.status}
              index={columnIndex}
              id={column.id as TaskStatus}
              title={column.title}
              status={column.status as TaskStatus}
            >
              {tasks.filter((task) => task.status === column.status)}
            </ColumnCmp>
          ))}
          <DragOverlay>
            {dragOverlayId &&
              (() => {
                const task = tasks.find((t) => t.id === dragOverlayId);
                if (!task) return null;
                const index = tasks
                  .filter((t) => t.status === task.status)
                  .findIndex((t) => t.id === task.id);
                return (
                  <TaskCard
                    {...task}
                    column={task.status}
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
