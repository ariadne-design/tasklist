import TaskCard from './taskCard';
import { TaskStatus, TaskType } from './taskTypes';
export default function ColumnCmp({
  id,
  title,
  status,
  children,
}: {
  id: number;
  title: string;
  status: TaskStatus;
  children?: TaskType[];
}) {
  const statusBgColor = {
    todo: 'bg-red-200',
    inprogress: 'bg-yellow-200',
    done: 'bg-green-200',
  };
  return (
    <div
      className={`w-[600px] bg-gray-100 rounded-2xl p-4 ${statusBgColor[status]}`}
    >
      <div className="text-center">{title}</div>
      <div className="mt-4">
        {children?.map((child) => (
          <TaskCard
            key={child.id}
            id={child.id}
            title={child.title}
            description={child.description}
            createTime={child.createTime}
          />
        ))}
      </div>
    </div>
  );
}
