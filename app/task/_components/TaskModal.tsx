'use client';

import { TaskStatus, TaskType } from '@/types/taskType';
import { Form, Input, Modal, Select } from 'antd';

type editTaskType = Omit<TaskType, 'id' | 'createTime'>;

interface TaskModalProps {
  id?: number;
  open: boolean;
  mode: 'create' | 'edit';
  editTask?: editTaskType;
  onClose: () => void;
  onConfirm: (values: FiedType) => void;
}

type FiedType = {
  title: string;
  description: string;
  status: TaskStatus;
};
export default function AddTaskModal({
  mode,
  editTask,
  open,
  onClose,
  onConfirm,
}: TaskModalProps) {
  const [form] = Form.useForm<FiedType>();

  const initialValues = mode === 'edit' ? editTask : undefined;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={mode === 'edit' ? 'Edit Task' : 'Add Task'}
      onOk={() => form.submit()}
      destroyOnHidden
      centered
    >
      <Form
        name="task"
        form={form}
        onFinish={onConfirm}
        initialValues={initialValues}
      >
        <Form.Item<FiedType>
          label="task Title"
          name="title"
          rules={[{ required: true, message: 'Please input the title' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FiedType>
          label="Content Description"
          name="description"
          rules={[{ required: true, message: 'Please input the description' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item<FiedType>
          label="task Status"
          name="status"
          rules={[{ required: true, message: 'Please select the status' }]}
        >
          <Select
            options={[
              { label: 'Todo', value: 'todo' },
              { label: 'InProgress', value: 'inprogress' },
              { label: 'Done', value: 'done' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
