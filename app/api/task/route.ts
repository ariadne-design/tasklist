import { prisma } from '@/lib/prisma';
import { ColumnTasks, TaskType } from '@/types/taskType';
import { NextResponse } from 'next/server';

const STATUS_TO_COLUMN = {
  'column-todo': 'column_todo',
  'column-inprogress': 'column_inprogress',
  'column-done': 'column_done',
};

async function getColumnTasks(): Promise<ColumnTasks> {
  const tasks = await prisma.task.findMany({
    orderBy: { order: 'desc' },
  });
  const result: ColumnTasks = {
    'column-todo': [],
    'column-inprogress': [],
    'column-done': [],
  };
  tasks.forEach((task: TaskType) => {
    result[task.status as keyof ColumnTasks].push(task);
  });
  return result;
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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const title = typeof b.title === 'string' ? b.title.trim() : '';
  const status = typeof b.status === 'string' ? b.status : '';
  const columnId = STATUS_TO_COLUMN[status as keyof typeof STATUS_TO_COLUMN];

  if (!title || !columnId) {
    return NextResponse.json(
      { error: 'Invalid title or status' },
      { status: 400 },
    );
  }

  const description = typeof b.description === 'string' ? b.description : '';

  const { _max } = await prisma.task.aggregate({
    where: { columnId },
    _max: { order: true },
  });
  const order = (_max.order ?? 0) + 1;

  const task = await prisma.task.create({
    data: { title, status, description, columnId, order },
  });
  return NextResponse.json(
    { code: 0, message: '创建成功', data: null },
    { status: 201 },
  );
}

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  type ColumnKey = keyof typeof STATUS_TO_COLUMN;
  const { columns } = body as { columns?: ColumnTasks };
  if (!columns) {
    return NextResponse.json({ error: 'Invalid columns' }, { status: 400 });
  }

  await prisma.$transaction(
    (Object.keys(STATUS_TO_COLUMN) as ColumnKey[]).flatMap((col) => {
      const list = columns[col];
      const n = list.length;
      return list.map((task, index) =>
        prisma.task.update({
          where: { id: task.id },
          data: {
            status: col,
            columnId: STATUS_TO_COLUMN[col],
            order: n - 1 - index,
          },
        }),
      );
    }),
  );

  const data = await getColumnTasks();
  return NextResponse.json(
    { code: 0, message: 'success', data },
    { status: 200 },
  );
}
