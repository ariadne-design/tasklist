'use client';
import { TaskStatus, TaskType } from '@/types/taskType';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';
import { memo } from 'react';
import TaskCard from './taskCard';

const statusBgColor: Record<TaskStatus, string> = {
  'column-todo': 'bg-red-200',
  'column-inprogress': 'bg-yellow-200',
  'column-done': 'bg-green-200',
};

type ColumnCmpProps = {
  id: TaskStatus;
  title: string;
  index: number;
  children?: TaskType[];
};

function ColumnCmp({ id, title, index, children }: ColumnCmpProps) {
  const { ref } = useDroppable({
    id: `${id}`,
    type: 'column',
    accept: ['item', 'column'],
    collisionPriority: CollisionPriority.Low,
  });
  return (
    <div
      ref={ref}
      className={` bg-gray-100 rounded-2xl p-4 ${statusBgColor[id]} `}
    >
      <div className="text-center">{title}</div>
      <div
        className="mt-4 overflow-y-auto "
        style={{ height: 'calc(100vh - 300px)' }}
      >
        {children?.map((child, index) => (
          <TaskCard
            column={id as TaskStatus}
            key={child.id}
            id={child.id}
            index={index}
            title={child.title}
            status={child.status}
            description={child.description}
            createTime={child.createTime}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(ColumnCmp);
