# Task Management System

基于 Next.js、Tailwind CSS、Ant Design 与 Redux Toolkit 的简单任务看板。
实现功能有新增、跨列拖拽，使用Next集成了接口实现数据持久化
编辑功能与删除功能未实现持久化

## 技术栈

- Next.js、React
- Tailwind CSS、Ant Design
- Redux Toolkit
- Prisma、PostgreSQL

## 前置要求

- **Node.js** 20+（与 `package.json` 引擎一致即可）
- **Docker** 与 **Docker Compose**（用于本地 PostgreSQL；仅跑应用、已有数据库时可跳过）

## 使用 Docker 启动数据库并运行项目

仓库里的 [`compose.yaml`](./compose.yaml) 会拉起 **PostgreSQL 16**（容器内 `5432` 映射到本机 **`5433`**，避免与机器上已有 Postgres 冲突）。

### 1. 克隆并进入目录

```bash
git clone <https://github.com/ariadne-design/tasklist.git> nextfront
cd nextfront
```

### 2. 环境变量

复制示例文件并按需修改：

```bash
cp .env.example .env
```

若使用下方 Compose 默认数据库，`.env` 中 `DATABASE_URL` 可与 `.env.example` 一致：

```text
postgresql://app:app@localhost:5433/nextfront?schema=public
```

### 3. 启动数据库容器

```bash
docker compose up -d
```

（若使用旧版 Compose 插件，可改为：`docker-compose up -d`。）

确认容器运行：`docker compose ps`。

### 4. 安装依赖并初始化数据库

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

### 5. 启动开发服务器

```bash
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)，任务看板路径为 [/task](http://localhost:3000/task)。

### 停止数据库

```bash
docker compose down
```

需要同时删除数据卷时（**会清空数据库数据**）：

```bash
docker compose down -v
```

---

## 不使用 Docker 时

本机或远程已有 PostgreSQL 时，在 `.env` 中设置正确的 `DATABASE_URL`，然后执行 `npm install`、`npx prisma generate`、`npx prisma migrate deploy`、`npm run dev` 即可。

## 其它脚本

| 命令                | 说明                         |
| ------------------- | ---------------------------- |
| `npm run build`     | 生产构建                     |
| `npm run start`     | 启动生产服务（需先 build）   |
| `npm run lint`      | ESLint                       |
| `npx prisma studio` | 打开 Prisma 数据库可视化工具 |

---

## 参考

- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
