'use client';
import { useAppDispatch } from '@/store/hooks';
import { setEditTask } from '@/store/modalSlice';
import { deleteTask } from '@/store/taskSlice';
import { TaskStatus } from '@/types/taskType';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
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
    accept: ['item'],
    group: column,
  });
  const style = isDragging ? { opacity: 0.65 } : undefined;
  const dispatch = useAppDispatch();
  return (
    <div className="m-2">
      <Card
        className="w-full bg-gray-200 rounded-2xl p-4 cursor-grab"
        title={title}
        ref={ref}
        extra={
          column !== 'column-done' && (
            <div className="flex gap-2">
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  dispatch(
                    setEditTask({
                      id,
                      title,
                      description,
                      createTime,
                      status: column,
                    }),
                  )
                }
              >
                编辑
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => dispatch(deleteTask(id))}
              >
                删除
              </Button>
            </div>
          )
        }
      >
        <div className="text-left">Content:{description}</div>
        <div className="text-left">{createTime}</div>
      </Card>
    </div>
  );
}
