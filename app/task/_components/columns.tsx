'use client';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';
import TaskCard from './taskCard';
import { TaskStatus, TaskType } from './taskTypes';
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
    todo: 'bg-red-200',
    inprogress: 'bg-yellow-200',
    done: 'bg-green-200',
  };
  const { isDropTarget, ref } = useDroppable({
    id: id,
    type: 'column',
    accept: ['item', 'todo', 'inprogress', 'done'],
    collisionPriority: CollisionPriority.Low,
  });
  return (
    <div
      ref={ref}
      className={`w-[600px] bg-gray-100 rounded-2xl p-4 ${statusBgColor[status]} ${isDropTarget ? 'bg-blue-200' : ''}`}
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
