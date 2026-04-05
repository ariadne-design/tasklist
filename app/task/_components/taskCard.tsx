'use client';
import { useAppDispatch } from '@/store/hooks';
import { setEditTask } from '@/store/modalSlice';
import { TaskStatus, TaskType } from '@/types/taskType';
import { EditOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/react/sortable';
import { Button, Card } from 'antd';
export default function TaskCard({
  id,
  title,
  description,
  createTime,
  status,
  index,
  column,
}: {
  id: string;
  title: string;
  description: string;
  createTime: string;
  status: TaskStatus;
  index: number;
  column: TaskStatus;
}) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'item',
    accept: ['item', 'todo', 'inprogress', 'done'],
    group: column,
  });
  const style = isDragging ? { opacity: 0.85 } : undefined;
  const dispatch = useAppDispatch();
  return (
    <>
      <Card
        className="w-full bg-gray-200 rounded-2xl p-4"
        title={title}
        ref={ref}
        style={style}
        extra={
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              dispatch(
                setEditTask({
                  id,
                  title,
                  description,
                  createTime,
                  status,
                } as TaskType),
              )
            }
          >
            编辑
          </Button>
        }
      >
        <div className="text-left">{description}</div>
        <div className="text-left">{createTime}</div>
      </Card>
    </>
  );
}
