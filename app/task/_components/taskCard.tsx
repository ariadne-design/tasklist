'use client';
import { useAppDispatch } from '@/store/hooks';
import { setEditTask } from '@/store/modalSlice';
import { deleteTask } from '@/store/taskSlice';
import { TaskStatus } from '@/types/taskType';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { SortableKeyboardPlugin } from '@dnd-kit/dom/sortable';
import { useSortable } from '@dnd-kit/react/sortable';
import { Button, Card } from 'antd';

export type TaskCardProps = {
  id: string;
  title: string;
  description: string;
  createTime: string;
  status: TaskStatus;
  index: number;
  column: TaskStatus;
  /** true = 仅用于 DragOverlay 预览，不参与 sortable，避免与列表占位共用 isDragging 样式 */
  dragOverlay?: boolean;
};

function TaskCardBody({
  id,
  title,
  description,
  createTime,
  column,
}: Omit<TaskCardProps, 'index' | 'status' | 'dragOverlay'>) {
  const dispatch = useAppDispatch();
  return (
    <Card
      className="w-full bg-gray-200 rounded-2xl p-4 cursor-grab shadow-md"
      title={title}
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
  );
}

function TaskCardSortable(props: TaskCardProps) {
  const { id, index, column, title, description, createTime } = props;
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'item',
    accept: ['item'],
    group: column,
    plugins: [SortableKeyboardPlugin],
  });
  const placeholderStyle = isDragging
    ? { opacity: 0.45, transition: 'opacity 0.15s ease' }
    : undefined;
  return (
    <div className="m-2" ref={ref} style={placeholderStyle}>
      <TaskCardBody
        id={id}
        title={title}
        description={description}
        createTime={createTime}
        column={column}
      />
    </div>
  );
}

export default function TaskCard(props: TaskCardProps) {
  if (props.dragOverlay) {
    const { id, title, description, createTime, column } = props;
    return (
      <div className="m-2">
        <TaskCardBody
          id={id}
          title={title}
          description={description}
          createTime={createTime}
          column={column}
        />
      </div>
    );
  }
  return <TaskCardSortable {...props} />;
}
