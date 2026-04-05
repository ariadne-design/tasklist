'use client';
import { TaskStatus, TaskType } from '@/types/taskType';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import AddTaskModal from './addTaskModal';
import ColumnCmp from './columns';
export default function Kanbanboard() {
  const [open, setOpen] = useState(false);
  const columns = [
    { id: 1, title: 'Todo', status: 'todo' },
    { id: 2, title: 'InProgress', status: 'inprogress' },
    { id: 3, title: 'Done', status: 'done' },
  ];

  const tasks: TaskType[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Task 1 Record meeting content',
      createTime: Date.now().toString(),
      status: 'todo',
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Task 2 description',
      createTime: Date.now().toString(),
      status: 'inprogress',
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Task 3 description',
      createTime: Date.now().toString(),
      status: 'done',
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <AddTaskModal
        open={open}
        onClose={() => setOpen(false)}
      />
      <Button
        icon={<PlusOutlined />}
        className="ml-2 w-fit mt-4"
        onClick={() => setOpen(true)}
      >
        Add Task
      </Button>
      <div className="w-full flex flex-row justify-around gap-4 p-4 min-h-[300px] max-h-[800px] overflow-y-auto">
        {columns.map((column) => (
          <ColumnCmp
            key={column.id}
            id={column.id}
            title={column.title}
            status={column.status as TaskStatus}
          >
            {tasks.filter((task) => task.status === column.status)}
          </ColumnCmp>
        ))}
      </div>
    </div>
  );
}
