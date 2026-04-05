'use client';
import { TaskStatus, TaskType } from '@/types/taskType';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';
import TaskCard from './taskCard';
export default function ColumnCmp({
  id,
  title,
  index,
  status,
  children,
}: {
  id: TaskStatus;
  title: string;
  index: number;
  status: TaskStatus;
  children?: TaskType[];
}) {
  const statusBgColor = {
    'column-todo': 'bg-red-200',
    'column-inprogress': 'bg-yellow-200',
    'column-done': 'bg-green-200',
  };
  const { isDropTarget, ref } = useDroppable({
    id: `${id}`,
    type: 'column',
    accept: ['item', 'column'],
    collisionPriority: CollisionPriority.Low,
  });
  return (
    <div
      ref={ref}
      className={`w-[600px] bg-gray-100 rounded-2xl p-4 ${statusBgColor[status as keyof typeof statusBgColor]} `}
    >
      <div className="text-center">{title}</div>
      <div className="mt-4">
        {children?.map((child, index) => (
          <TaskCard
            key={child.id}
            id={child.id}
            index={index}
            column={status}
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
