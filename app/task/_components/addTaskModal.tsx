'use client';

import { TaskStatus } from '@/types/taskType';
import { Form, Input, Modal, Select } from 'antd';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

type FiedType = {
  title: string;
  description: string;
  status: TaskStatus;
};
export default function AddTaskModal({ open, onClose }: AddTaskModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Add Task"
      destroyOnHidden
      centered
    >
      <Form name="task">
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
