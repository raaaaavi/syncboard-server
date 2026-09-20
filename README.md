# SyncBoard API (syncboard-server)

Milestone 3 — a working full-stack backend: the mock in-memory data from
Milestone 2 has been replaced with a real MongoDB Atlas database via
Mongoose. The REST API's routes and JSON response shapes are unchanged, so
the existing syncboard-client front end works against it with no code
changes — only its `.env` needs to point at this server.

## Tech stack

- Node.js + Express
- **MongoDB Atlas + Mongoose** (Member, Board, Column, Task collections)
- CORS, Morgan (request logging)
- Swagger (OpenAPI) docs via swagger-jsdoc + swagger-ui-express

## Data model

```
Member  (_id, initials, name, color, role)
Board   (_id, name, memberIds: [Member], starred)
Column  (_id, boardId: Board, title, order, accent)
Task    (_id, boardId: Board, columnId: Column, title, tag, assigneeId: Member, due, comments)
```

Ids are short human-readable strings (e.g. `b1`, `t1`, `u1`) rather than raw
ObjectIds, so they stay consistent with the earlier milestones' mock data,
the Postman collection, and the report.

## 1. Create a free MongoDB Atlas database

1. Sign up at https://www.mongodb.com/cloud/atlas/register (free tier, no card required).
2. Create a new **free (M0) cluster**.
3. Under **Database Access**, add a database user with a username/password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) for development.
5. Click **Connect → Drivers**, copy the connection string — it looks like:
   `mongodb+srv://<db_user>:<db_password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority`
6. Add a database name to the path, e.g. `.../syncboard?retryWrites=true...`.

## 2. Configure and run

```bash
cp .env.example .env
# paste your Atlas connection string into MONGODB_URI in .env

npm install
npm run seed   # populates Members, Boards, Columns and Tasks
npm run dev    # starts the API on http://localhost:5000
```

Swagger docs: **http://localhost:5000/api-docs**

## Project structure

```
src/
  server.js          entry point — connects to Atlas, then starts Express
  app.js             Express app assembly
  config/db.js        Mongoose connection
  models/             Member, Board, Column, Task (Mongoose schemas)
  routes/             boardRoutes, taskRoutes, teamRoutes
  controllers/         request handlers — now query MongoDB directly
  seed.js              one-off script to populate demo data
  middleware/          404 + error handler
  docs/swagger.js      OpenAPI spec config
```

## Endpoints

| Method | Endpoint                  | Description                              |
|--------|----------------------------|-------------------------------------------|
| GET    | `/api/boards`               | List all boards (with members, counts)    |
| POST   | `/api/boards`                | Create a board (auto-creates To Do/Doing/Done columns) |
| GET    | `/api/boards/:id`            | Get one board                             |
| GET    | `/api/boards/:id/columns`     | Get columns for a board, populated with tasks |
| PATCH  | `/api/boards/:id/star`         | Toggle a board's starred/favourite flag   |
| GET    | `/api/tasks?boardId=b1`       | List tasks for a board                    |
| POST   | `/api/tasks`                 | Create a task                             |
| GET    | `/api/tasks/:id`              | Get one task                              |
| PATCH  | `/api/tasks/:id/move`          | Move a task to a different column         |
| DELETE | `/api/tasks/:id`               | Delete a task                             |
| GET    | `/api/team`                  | List team members                         |

## Known limitations (Milestone 3)

- No authentication yet — planned before real-time sync lands.
- No offline persistence on the client yet — planned for a later milestone.
- Task creation resolves `columnId` against the board's real `Column`
  documents, but there's no UI yet for creating boards/columns themselves.
