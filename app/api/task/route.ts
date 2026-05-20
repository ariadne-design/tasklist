import { prisma } from '@/lib/prisma';
import { ColumnTasks, TaskStatus, TaskType } from '@/types/taskType';
import { ColumnType, Prisma, Task } from '@prisma/client';
import { NextResponse } from 'next/server';

const STATUS_TO_COLUMN: Record<TaskStatus, ColumnType> = {
  'column-todo': ColumnType.column_todo,
  'column-inprogress': ColumnType.column_inprogress,
  'column-done': ColumnType.column_done,
};

function isTaskStatus(value: string): value is TaskStatus {
  return value in STATUS_TO_COLUMN;
}

function toTaskType(task: Task): TaskType {
  const status = task.status;
  if (!isTaskStatus(status)) {
    throw new Error(`Invalid task status: ${status}`);
  }
  return {
    id: task.id,
    title: task.title,
    status,
    description: task.description,
    createTime: task.createTime.toISOString(),
  };
}

async function getColumnTasks(): Promise<ColumnTasks> {
  const tasks = await prisma.task.findMany({
    orderBy: { order: 'asc' },
  });
  const result: ColumnTasks = {
    'column-todo': [],
    'column-inprogress': [],
    'column-done': [],
  };
  tasks.forEach((task) => {
    const mapped = toTaskType(task);
    result[mapped.status].push(mapped);
  });
  return result;
}

type ColumnKey = keyof typeof STATUS_TO_COLUMN;

/** 仅查询指定列，用于 PATCH 后返回增量数据 */
async function getColumnTasksPartial(
  cols: ColumnKey[],
): Promise<Partial<ColumnTasks>> {
  if (cols.length === 0) return {};
  const lists = await Promise.all(
    cols.map((col) =>
      prisma.task.findMany({
        where: { status: col },
        orderBy: { order: 'asc' },
      }),
    ),
  );
  const partial: Partial<ColumnTasks> = {};
  cols.forEach((col, i) => {
    partial[col] = lists[i].map(toTaskType);
  });
  return partial;
}

export async function GET() {
  const data = await getColumnTasks();
  const response: { code: number; message: string; data: ColumnTasks } = {
    code: 0,
    message: 'success',
    data,
  };
  return NextResponse.json(response, { status: 200 });
}

export async function POST(request: Request) {
  const b = (await request.json()) as {
    title?: string;
    status?: string;
    description?: string;
  };
  const title = (b.title ?? '').trim();
  const status = b.status ?? '';
  if (!isTaskStatus(status)) {
    return NextResponse.json(
      { code: 1, message: '无效的列状态', data: null },
      { status: 400 },
    );
  }
  const columnId = STATUS_TO_COLUMN[status];
  const description = b.description ?? '';

  const { _max } = await prisma.task.aggregate({
    where: { columnId },
    _max: { order: true },
  });
  const maxOrder = _max?.order ?? new Prisma.Decimal(0);
  const order = maxOrder.add(1);

  await prisma.task.create({
    data: { title, status, description, columnId, order },
  });
  return NextResponse.json(
    { code: 0, message: '创建成功', data: null },
    { status: 201 },
  );
}

export async function PATCH(request: Request) {
  const { columns = {} } = (await request.json()) as {
    columns?: Partial<ColumnTasks>;
  };
  const colKeys = Object.keys(columns).filter(
    (k): k is ColumnKey => k in STATUS_TO_COLUMN,
  );

  await prisma.$transaction(
    colKeys.flatMap((col) => {
      const list = columns[col] as TaskType[];
      return list.map((task, index) =>
        prisma.task.update({
          where: { id: task.id },
          data: {
            status: col,
            columnId: STATUS_TO_COLUMN[col],
            order: index,
          },
        }),
      );
    }),
  );

  const data = await getColumnTasksPartial(colKeys);
  return NextResponse.json(
    { code: 0, message: 'success', data },
    { status: 200 },
  );
}
