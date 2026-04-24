# Course Platform AI Context

This document is a high-signal project briefing for any AI model or engineer that needs to work on this repository correctly.

## 1. Project Summary

- Project type: monorepo
- Product: online course platform
- Main apps:
  - `apps/web`: Next.js frontend
  - `apps/api`: Express + MongoDB backend
- Package manager: `pnpm`
- Workspace config: `pnpm-workspace.yaml`

Core product roles:

- `student`
  - registers/logs in
  - browses courses
  - enrolls in courses
  - rates courses
  - updates progress for enrolled courses
  - comments on lessons only after enrolling in the parent course
- `instructor`
  - registers/logs in
  - creates courses
  - adds lessons only to their own courses

There is no admin role.

## 2. Monorepo Structure

```text
course-platform/
  package.json
  pnpm-workspace.yaml
  apps/
    api/
      package.json
      src/
        app.js
        server.js
        config/
        middlewares/
        modules/
          auth/
          comments/
          courses/
          enrollments/
          lessons/
          users/
        routes/
        utils/
    web/
      package.json
      next.config.mjs
      src/
        app/
        components/
        hooks/
        lib/
```

## 3. Tech Stack

### Frontend

- Next.js `16.2.4`
- React `19.2.4`
- Tailwind CSS v4 via `@tailwindcss/postcss`
- App Router
- Client auth state stored in browser storage
- Decorative animations:
  - `gsap`
  - canvas/DOM animated backgrounds
  - custom cursor

### Backend

- Express `5.2.1`
- MongoDB via Mongoose `8.18.1`
- JWT auth via `jsonwebtoken`
- Password hashing via `bcryptjs`
- Validation via `zod`
- Security middleware:
  - `helmet`
  - `cors`

## 4. Run and Environment

### Root scripts

From root `package.json`:

- `pnpm dev:api`
- `pnpm dev:web`
- `pnpm start:api`
- `pnpm start:web`

### API environment variables

Defined/used in `apps/api/src/config/env.js`:

- `PORT`
  - default: `5000`
- `MONGODB_URI`
  - required
- `JWT_SECRET`
  - required
- `JWT_EXPIRES_IN`
  - default: `7d`
- `NODE_ENV`
  - default: `development`

If `MONGODB_URI` or `JWT_SECRET` is missing, the API crashes on startup.

### Web environment variables

Defined/used in `apps/web/src/lib/api.js`:

- `NEXT_PUBLIC_API_URL`
  - required for frontend API calls
  - should point to the backend base including `/api/v1`
  - recommended local value:
    - `http://localhost:5000/api/v1`

If `NEXT_PUBLIC_API_URL` is missing, frontend requests fail with:

- `NEXT_PUBLIC_API_URL is not configured`

## 5. Backend Architecture

### Entry flow

- `apps/api/src/server.js`
  - loads app
  - connects MongoDB
  - starts HTTP server
- `apps/api/src/app.js`
  - adds `helmet`
  - adds `cors`
  - adds `express.json()`
  - mounts routes under `/api/v1`
  - adds 404 middleware
  - adds error middleware

### Route root

Defined in `apps/api/src/routes/index.js`:

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/courses`
- `GET /api/v1/courses/:courseId`
- `POST /api/v1/courses`
- `PATCH /api/v1/courses/:courseId`
- `DELETE /api/v1/courses/:courseId`
- `POST /api/v1/courses/:courseId/rating`
- `GET /api/v1/courses/:courseId/lessons`
- `POST /api/v1/courses/:courseId/lessons`
- `GET /api/v1/lessons/:lessonId`
- `PATCH /api/v1/lessons/:lessonId`
- `DELETE /api/v1/lessons/:lessonId`
- `POST /api/v1/courses/:courseId/enroll`
- `PATCH /api/v1/courses/:courseId/progress`
- `GET /api/v1/enrollments/me`
- `GET /api/v1/lessons/:lessonId/comments`
- `POST /api/v1/lessons/:lessonId/comments`
- `GET /api/v1/comments/:commentId`
- `PATCH /api/v1/comments/:commentId`
- `DELETE /api/v1/comments/:commentId`

### Shared backend conventions

- Success format:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

- Error format:

```json
{
  "success": false,
  "message": "Error message"
}
```

- In non-production, error responses may also include `stack`.
- Validation is centralized through `validate.middleware.js` and Zod schemas.
- Auth is Bearer token only.
- No refresh tokens.
- No backend-managed cookie auth.

## 6. Backend Data Models

### User

File: `apps/api/src/modules/users/user.model.js`

Fields:

- `name`: string, required, 2-100 chars
- `email`: string, required, unique, lowercase, trimmed
- `password`: string, required, min 6, `select: false`
- `role`: enum `["instructor", "student"]`, default `student`
- timestamps enabled

### Course

File: `apps/api/src/modules/courses/course.model.js`

Fields:

- `title`: string, required, 3-150 chars
- `description`: string, required, 10-2000 chars
- `category`: string, required, max 100
- `instructor`: ObjectId ref `User`, required
- `averageRating`: number, default `0`, min `0`, max `5`
- `ratings`: array of:
  - `student`: ObjectId ref `User`
  - `rating`: number 1-5
- timestamps enabled

Indexes:

- text index on `title`, `description`
- compound index on `category`, `createdAt`

### Lesson

File: `apps/api/src/modules/lessons/lesson.model.js`

Fields:

- `course`: ObjectId ref `Course`, required
- `title`: string, required, 3-150 chars
- `content`: string, required, min 10
- `order`: number, required, min 1
- timestamps enabled

Indexes:

- unique compound index on `course`, `order`

### Enrollment

File: `apps/api/src/modules/enrollments/enrollment.model.js`

Fields:

- `student`: ObjectId ref `User`, required
- `course`: ObjectId ref `Course`, required
- `enrolledAt`: date, default now
- `progressPercent`: number, default `0`, range `0-100`
- timestamps enabled

Indexes:

- unique compound index on `student`, `course`

### Comment

File: `apps/api/src/modules/comments/comment.model.js`

Fields:

- `lesson`: ObjectId ref `Lesson`, required
- `student`: ObjectId ref `User`, required
- `content`: string, required, 1-1000 chars
- timestamps enabled

Indexes:

- compound index on `lesson`, `createdAt`

## 7. Backend Business Rules

### Auth rules

- Register accepts optional role.
- Login returns JWT and user info.
- Protected routes use `Authorization: Bearer <token>`.
- Token payload contains only `userId`.

### Role rules

- Only `instructor` can create courses.
- Only `instructor` can update courses.
- Only `instructor` can delete courses.
- Only `instructor` can create lessons.
- Only `instructor` can update lessons.
- Only `instructor` can delete lessons.
- Only `student` can enroll.
- Only `student` can rate courses.
- Only `student` can update progress.
- Only `student` can comment.
- Only `student` can update their own comments.

### Ownership rules

- An instructor can update/delete only their own courses.
- An instructor can add lessons only to courses they own.
- An instructor can update/delete lessons only in courses they own.
- An instructor can delete comments only if the comment belongs to a lesson inside a course they own.

### Enrollment rules

- A student cannot enroll in the same course twice.
- A student must be enrolled in the lesson's parent course before posting comments.
- Progress update requires an enrollment record.

### Rating rules

- Students can rate a course without being enrolled.
- Re-rating updates existing rating instead of creating a second rating entry.
- `averageRating` is recalculated on every rating change.

## 8. Backend API Contracts

### Health

`GET /api/v1/health`

Response:

```json
{
  "success": true,
  "message": "API is healthy"
}
```

### Auth

#### Register

`POST /api/v1/auth/register`

Body:

```json
{
  "name": "David",
  "email": "david@example.com",
  "password": "123456",
  "role": "student"
}
```

Response `201`:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt",
    "user": {
      "id": "userId",
      "name": "David",
      "email": "david@example.com",
      "role": "student"
    }
  }
}
```

#### Login

`POST /api/v1/auth/login`

Body:

```json
{
  "email": "david@example.com",
  "password": "123456"
}
```

Response `200` has same `data` shape as register.

### Courses

#### List courses

`GET /api/v1/courses?page=1&limit=10&search=&category=&instructor=&sortBy=newest`

Query rules:

- `page`: integer >= 1
- `limit`: integer 1-50
- `search`: optional text search on title/description
- `category`: optional exact match
- `instructor`: optional instructor id
- `sortBy`: `newest | oldest | rating`

Response:

```json
{
  "success": true,
  "message": "Courses fetched successfully",
  "data": {
    "items": [],
    "pagination": {
      "total": 0,
      "page": 1,
      "limit": 10,
      "totalPages": 0
    }
  }
}
```

Important:

- `listCourses` populates `instructor` with `name email role`.
- `pagination.totalPages` can become `0` when there are no records.

#### Get one course

`GET /api/v1/courses/:courseId`

Response returns a full course document populated with `instructor`.

#### Create course

`POST /api/v1/courses`

Auth:

- Bearer token required
- role must be `instructor`

Body:

```json
{
  "title": "Node.js Basics",
  "description": "Long enough description here",
  "category": "Backend"
}
```

#### Update course

`PATCH /api/v1/courses/:courseId`

Auth:

- Bearer token required
- role must be `instructor`
- must own the course

Body:

```json
{
  "title": "Advanced Node.js Basics",
  "description": "Updated description",
  "category": "Backend"
}
```

Notes:

- at least one of `title`, `description`, or `category` is required

#### Delete course

`DELETE /api/v1/courses/:courseId`

Auth:

- Bearer token required
- role must be `instructor`
- must own the course

Behavior:

- deletes the course
- deletes all lessons in the course
- deletes all comments attached to those lessons
- deletes all enrollments for the course

#### Rate course

`POST /api/v1/courses/:courseId/rating`

Auth:

- Bearer token required
- role must be `student`

Body:

```json
{
  "rating": 5
}
```

Behavior:

- creates new rating or updates existing rating by same student
- response returns the updated course document

### Lessons

#### List lessons for course

`GET /api/v1/courses/:courseId/lessons`

Response:

- array of lessons sorted by `order ASC, createdAt ASC`

#### Create lesson

`POST /api/v1/courses/:courseId/lessons`

Auth:

- Bearer token required
- role must be `instructor`
- must own the course

Body:

```json
{
  "title": "Introduction",
  "content": "Lesson content...",
  "order": 1
}
```

#### Get one lesson

`GET /api/v1/lessons/:lessonId`

Response:

- returns the lesson
- populates `course` with `title instructor`

#### Update lesson

`PATCH /api/v1/lessons/:lessonId`

Auth:

- Bearer token required
- role must be `instructor`
- must own the parent course

Body:

```json
{
  "title": "Updated lesson title",
  "content": "Updated lesson content",
  "order": 2
}
```

Notes:

- at least one field is required
- `title`, `content`, and `order` are individually optional

#### Delete lesson

`DELETE /api/v1/lessons/:lessonId`

Auth:

- Bearer token required
- role must be `instructor`
- must own the parent course

Behavior:

- deletes the lesson
- deletes all comments associated with that lesson

### Enrollments

#### Enroll in course

`POST /api/v1/courses/:courseId/enroll`

Auth:

- Bearer token required
- role must be `student`

Behavior:

- creates an enrollment with `progressPercent = 0`
- duplicate enrollment returns `409`

#### List my enrollments

`GET /api/v1/enrollments/me?page=1&limit=10`

Auth:

- Bearer token required
- role must be `student`

Response:

- paginated enrollment list
- each enrollment populates `course`
- each populated course also populates `instructor`

#### Update progress

`PATCH /api/v1/courses/:courseId/progress`

Auth:

- Bearer token required
- role must be `student`
- student must already be enrolled

Body:

```json
{
  "progressPercent": 65
}
```

### Comments

#### List comments for lesson

`GET /api/v1/lessons/:lessonId/comments?page=1&limit=10`

Response:

- paginated comments sorted newest first
- `student` is populated with `name email role`

#### Create comment

`POST /api/v1/lessons/:lessonId/comments`

Auth:

- Bearer token required
- role must be `student`
- must be enrolled in the lesson's parent course

Body:

```json
{
  "content": "Very helpful lesson"
}
```

#### Get one comment

`GET /api/v1/comments/:commentId`

Response:

- returns the comment
- populates `student`
- populates `lesson` with `title course`

#### Update comment

`PATCH /api/v1/comments/:commentId`

Auth:

- Bearer token required
- role must be `student`
- student must own the comment

Body:

```json
{
  "content": "Updated comment content"
}
```

#### Delete comment

`DELETE /api/v1/comments/:commentId`

Auth:

- Bearer token required

Allowed actors:

- the student who owns the comment
- the instructor who owns the course containing the lesson containing the comment

## 9. Backend Middlewares and Utils

### `auth.middleware.js`

- reads only `Authorization` header
- expects `Bearer <token>`
- verifies JWT
- fetches current user from DB
- attaches `req.user`

### `role.middleware.js`

- `restrictTo(...roles)`
- checks `req.user.role`

### `validate.middleware.js`

- validates `body`, `params`, and `query`
- overwrites request data with parsed/coerced values

### `error.middleware.js`

- returns `err.statusCode || 500`
- exposes stack outside production

### `notFound.middleware.js`

- returns JSON 404 for unmatched routes

### `pickFields.js`

- used for safe query filter extraction in courses listing

### `asyncHandler.js`

- async controller wrapper for centralized error handling

## 10. Frontend Architecture

### Routing

Next.js App Router pages:

- `/`
- `/login`
- `/register`
- `/courses`
- `/courses/new`
- `/courses/[id]`
- `/me/enrollments`

Error/loading handlers exist for:

- root app
- courses list
- course detail
- enrollments page

### Layout

`apps/web/src/app/layout.js`

Global layout includes:

- `Navbar`
- `CustomCursor`
- `BackgroundAnimation`
- `NetworkBackground`
- footer

### Styling

- Tailwind utility classes dominate UI styling
- `globals.css` defines many custom CSS variables
- app has animated/decorative background layers
- `body { cursor: none; }` because of custom cursor

### Path alias

`apps/web/jsconfig.json`

- `@/*` maps to `./src/*`

## 11. Frontend Auth and Session Model

Files:

- `apps/web/src/lib/auth.js`
- `apps/web/src/hooks/useAuth.js`
- `apps/web/src/middleware.js`

### Current auth storage

On login/register success, frontend stores:

- JWT in `localStorage` key: `cp_token`
- user object in `localStorage` key: `cp_user`
- duplicate token in a browser cookie: `cp_token`

Important:

- This cookie is created from frontend JavaScript, not backend.
- It is not `httpOnly`.
- There is a TODO note saying production should use backend-set `httpOnly` cookie instead.

### `useAuth()` behavior

- loads user and token from localStorage on mount
- provides:
  - `user`
  - `token`
  - `role`
  - `isLoggedIn`
  - `logout()`

### Next middleware behavior

`apps/web/src/middleware.js`

- If path starts with `/me` and cookie `cp_token` is missing:
  - redirect to `/login`
- If path is `/login` or `/register` and cookie exists:
  - redirect to `/courses`

Important limitation:

- Middleware checks only cookie presence, not token validity.

### SSR auth usage

`/me/enrollments` reads `cp_token` from cookies via `next/headers` and forwards it to backend using Authorization header.

## 12. Frontend Pages and Behavior

### Home page `/`

File: `apps/web/src/app/page.js`

- marketing-style landing page
- links to courses, register, login

### Login page `/login`

File: `apps/web/src/app/login/page.js`

- client component
- posts to `/auth/login`
- on success:
  - calls `saveAuth`
  - redirects to `/courses`

### Register page `/register`

File: `apps/web/src/app/register/page.js`

- client component
- posts to `/auth/register`
- allows user to choose role:
  - `student`
  - `instructor`
- on success:
  - calls `saveAuth`
  - redirects to `/courses`

### Courses page `/courses`

File: `apps/web/src/app/courses/page.js`

- server component
- reads `searchParams`
- calls backend list endpoint
- supports:
  - search
  - category filter
  - sort by newest/oldest/rating
  - pagination
- renders `CourseCard`

### New course page `/courses/new`

File: `apps/web/src/app/courses/new/page.js`

- client component
- intended for instructors
- creates a course through `POST /courses`
- redirects to the new course detail page after success
- shows guard UI for:
  - unauthenticated users
  - logged-in non-instructor users

### Course detail page `/courses/[id]`

Files:

- `apps/web/src/app/courses/[id]/page.js`
- `apps/web/src/components/CourseDetailClient.js`

Flow:

- server component fetches course and lessons in parallel
- if course fetch fails, page calls `notFound()`
- client component handles all user actions

Student UI actions:

- enroll
- rate course
- update progress
- edit own comments
- delete own comments

Instructor UI actions:

- edit course
- delete course
- add lesson
- edit lesson
- delete lesson
- delete comments inside lessons of their own course
- lesson management is enabled only when logged-in instructor owns the course

Lesson display:

- each lesson renders `LessonItem`
- each lesson includes `CommentBox`

### My enrollments page `/me/enrollments`

File: `apps/web/src/app/me/enrollments/page.js`

- server component
- reads token from cookie
- redirects to `/login` if missing
- fetches `/enrollments/me?page=1&limit=20`
- shows course cards with progress bar

## 13. Frontend Components

### `Navbar`

- shows auth-dependent links
- always shows `/courses`
- shows `/courses/new` when logged-in user is an instructor
- shows `/me/enrollments` only when logged in
- uses `Badge` to display role
- logout clears local auth and redirects to `/login`

### `CourseCard`

- links to course detail
- shows category, description, rating, instructor

### `CourseDetailClient`

Main interactive page logic:

- derives current role from `useAuth()`
- determines course ownership via:
  - `course.instructor._id` or `course.instructor`
  - compared to `user.id`
- handles:
  - course update
  - course deletion
  - enrollment
  - rating
  - progress update
  - lesson creation
  - lesson update
  - lesson deletion
- normalizes course rating display from backend shape:
  - `averageRating`
  - `ratings.length`

### `LessonItem`

- displays lesson order/title/content
- supports instructor-side lesson editing/deletion
- renders `CommentBox`

### `CommentBox`

- fetches comments client-side on mount
- posts comment if `canComment && token`
- lets the owning student edit/delete their own comment
- lets the owning instructor of the parent course delete comments for moderation
- refreshes list after post

### Decorative components

- `BackgroundAnimation.jsx`
  - creates floating animated dots with GSAP
- `NetworkBackground.jsx`
  - draws animated network lines on canvas
- `CustomCursor.jsx`
  - hides native cursor and replaces it with animated custom cursor

## 14. API Client Behavior in Frontend

File: `apps/web/src/lib/api.js`

`apiFetch(path, options)`:

- builds URL from `NEXT_PUBLIC_API_URL`
- defaults to `GET`
- JSON-encodes body for non-GET/non-HEAD
- adds `Authorization` header when `token` exists
- uses `cache: "no-store"`
- tries to parse JSON response
- returns normalized shape:

```js
{ data, error }
```

Important:

- It expects backend success responses to use either `json.data` or raw JSON.
- On non-OK response it returns `error` with backend `message` when available.

## 15. Important Current Gaps and Caveats

These are important for any future AI making changes.

### 1. Auth is not production-grade yet

- token is stored in localStorage
- cookie is client-set, not `httpOnly`
- middleware trusts cookie existence only
- no refresh token strategy

### 2. Student progress UI is not hydrated from actual enrollment

On course detail page:

- progress slider starts from local component state `0`
- it does not preload the student's existing enrollment progress

### 3. Enroll button does not know if user is already enrolled

- frontend always offers enroll action to students
- duplicate enrollment is rejected by backend with `409`

### 4. Encoding/mojibake issues exist in several frontend files

There are visible corrupted characters in strings/comments such as:

- footer text
- emoji/text labels
- some CSS comments
- some component text

This looks like file encoding corruption and should be handled carefully when editing UI copy.

### 5. No test suite is currently configured

Observed from repository/package scripts:

- no unit test script
- no integration test script
- no e2e test script

### 6. Existing lint issues remain outside the latest CRUD work

Current known lint blockers in the web app:

- `apps/web/src/app/login/page.js`
  - unescaped apostrophe warning/error
- `apps/web/src/hooks/useAuth.js`
  - React 19 rule about synchronous `setState` inside `useEffect`

The latest lesson/comment/course CRUD changes were checked with `node --check`, and the remaining lint failures are pre-existing/non-CRUD issues.

### 7. Web README is stale/template content

`apps/web/README.md` is still the default Next.js template and does not describe the actual app.

### 8. Public lesson/comment reads

- Lessons are publicly listable for a course.
- Comments are publicly readable for a lesson.
- Only comment creation requires student enrollment.

## 16. Safe Mental Model for Future Changes

If another AI model is asked to change this project, it should assume:

- The backend is the source of truth for authorization and business rules.
- The frontend currently performs optimistic UI actions but does not own business logic.
- Role-sensitive operations must stay protected on backend even if hidden on frontend.
- The frontend expects JSON responses with top-level `message` and usually `data`.
- `NEXT_PUBLIC_API_URL` should already include `/api/v1`.
- Frontend auth currently depends on both localStorage and cookie duplication.
- `student` and `instructor` are the only supported roles everywhere.

## 17. Recommended Change Areas by Feature Type

### If asked to change auth

Primary files:

- `apps/web/src/lib/auth.js`
- `apps/web/src/hooks/useAuth.js`
- `apps/web/src/middleware.js`
- `apps/api/src/modules/auth/*`
- `apps/api/src/middlewares/auth.middleware.js`

### If asked to change course browsing/details

Primary files:

- `apps/web/src/app/courses/page.js`
- `apps/web/src/app/courses/[id]/page.js`
- `apps/web/src/components/CourseCard.js`
- `apps/web/src/components/CourseDetailClient.js`
- `apps/api/src/modules/courses/*`
- `apps/api/src/modules/lessons/*`

### If asked to change enrollments/progress

Primary files:

- `apps/web/src/app/me/enrollments/page.js`
- `apps/web/src/components/CourseDetailClient.js`
- `apps/api/src/modules/enrollments/*`

### If asked to change comments

Primary files:

- `apps/web/src/components/CommentBox.js`
- `apps/web/src/components/LessonItem.js`
- `apps/api/src/modules/comments/*`

## 18. Current Roadmap

### Current focus: Phase 1

Phase 1 is the current planned scope for the next set of upgrades.

Goals:

- complete course CRUD
- add profile update flow
- move auth toward backend-managed `httpOnly` cookies

Progress:

- course CRUD
  - backend: done
  - frontend: done for create/update/delete
- profile update flow
  - not started
- backend-managed `httpOnly` auth
  - not started

Planned backend work:

- `courses`
  - add update endpoint
  - add delete endpoint
- `users/auth`
  - add current-user/profile endpoint
  - add profile update endpoint
  - add backend cookie-based login/logout/session flow

Planned frontend work:

- instructor-side course editing/deletion UI
- profile page / profile form
- transition auth reads away from localStorage-first model
- update middleware and SSR pages to use backend cookie/session flow

## 19. Missing Features

Not currently implemented:

- admin dashboard
- instructor dashboard
- password reset
- email verification
- file uploads
- media lessons
- payments
- certificates
- backend cookie auth
- refresh tokens
- automated tests
- seed scripts

## 20. Suggested Local Setup Example

### API `.env`

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/course-platform
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Web `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Run locally

```bash
pnpm dev:api
pnpm dev:web
```

## 21. Final Working Notes for AI Models

When implementing future requests in this repo:

- inspect both frontend and backend before changing behavior
- verify whether a change needs both UI and API contract updates
- do not assume course rating fields are already normalized
- preserve `student` vs `instructor` rules
- treat auth/session code as transitional, not final architecture
- watch for encoding corruption when editing existing text
- if adding protected features, enforce on backend first, then reflect in frontend
