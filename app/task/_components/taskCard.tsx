'use client';
import { useDraggable } from '@dnd-kit/react';
import { Card } from 'antd';

export default function TaskCard({
  id,
  title,
  description,
  createTime,
}: {
  id: number;
  title: string;
  description: string;
  createTime: string;
}) {
  const { ref, isDragging } = useDraggable({
    id: id.toString(),
  });
  const style = isDragging ? { opacity: 0.85 } : undefined;
  return (
    <Card
      className="w-full bg-gray-200 rounded-2xl p-4"
      title={title}
      ref={ref}
      style={style}
    >
      <div className="text-left">{description}</div>
      <div className="text-left">{createTime}</div>
    </Card>
  );
}
