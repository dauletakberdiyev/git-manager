# 🧠 AI-Powered GitHub Workflow Tool (MVP)

## 🎯 Goal

Build a minimal SaaS product for solo developers that integrates with GitHub and automates development workflow:

- Manage tasks per repository
- Automatically create branches from tasks
- Automatically close tasks on PR merge
- Provide one AI-powered feature

---

## 🧩 Core Concept

1 repository = 1 project  
Each project has its own task board (kanban)

The system enhances GitHub workflow, not replaces it.

---

## 🏗️ Tech Stack

### Backend
- Node.js v22
- NestJS v10.x
- PostgreSQL v16
- Prisma ORM v6.x
- Redis v7.x (optional, for queues/webhooks) 

### Frontend
- React v18.3 (Vite or Next.js)
- TailwindCSS v3.4
- Zustand v4.x (state management)

### Integrations
- GitHub OAuth
- GitHub REST API
- GitHub Webhooks

### AI
- OpenAI API (or compatible LLM)

### Infra (optional for MVP)
- Docker
- Railway / Render / Fly.io

---

## 🔐 Authentication

### GitHub OAuth

Scopes:
- repo
- user

Flow:
1. User clicks "Login with GitHub"
2. Redirect to GitHub OAuth
3. Exchange code → access_token
4. Store:
   - githubId
   - username
   - accessToken

---

## 📦 Core Entities (Database)

### User
- id
- githubId
- username
- accessToken
- createdAt

### Project (Repository)
- id
- userId
- repoId (GitHub)
- name
- defaultBranch
- createdAt

### Task
- id
- projectId
- title
- status (TODO | IN_PROGRESS | DONE)
- branchName (nullable)
- createdAt

---

## 🔄 Core Features

---

### 1. Import GitHub Repositories

Endpoint:
GET /projects/import

Flow:
- Fetch user repos from GitHub API
- Save selected repos as Projects

---

### 2. Kanban Board (Minimal)

Columns:
- TODO
- IN_PROGRESS
- DONE

Task fields:
- title
- status

No:
- comments
- priorities
- deadlines
- assignees

---

### 3. Create Task → Auto Branch (🔥 Core Feature)

Endpoint:
POST /tasks

Input:
- projectId
- title

Flow:
1. Create task in DB
2. Generate branch name:
   - feature/{slugified-title}
3. Call GitHub API:
   - create branch from default branch
4. Save branchName in task

---

### 4. Move Task Between Columns

Endpoint:
PATCH /tasks/:id

Update:
- status

No side effects (for MVP)

---

### 5. GitHub Webhook (🔥 Core Feature)

Endpoint:
POST /webhooks/github

Handle:
- pull_request

Logic:
IF action == "closed" AND merged == true:
  → find related task by branchName
  → update task.status = DONE

---

## 🤖 AI Feature (ONLY ONE)

### Feature: Break Task into Subtasks

Endpoint:
POST /ai/breakdown

Input:
- taskTitle

Output:
- list of subtasks (array of strings)

Example:
Input:
"Build authentication system"

Output:
- Setup OAuth flow
- Create user model
- Store tokens securely
- Add login endpoint

---

## 🖥️ Frontend Pages

### 1. Login Page
- "Login with GitHub"

---

### 2. Projects Page
- List of imported repos
- Button: "Import Repositories"

---

### 3. Project Board Page

Display:
- Kanban board (3 columns)

Actions:
- Create task
- Drag & drop tasks
- Click task → show details

---

## 🔗 GitHub API Usage

### Create Branch
POST /repos/{owner}/{repo}/git/refs

### Get Default Branch
GET /repos/{owner}/{repo}

### Webhooks
- Subscribe to:
  - pull_request

---

## ⚙️ Folder Structure

### Backend
src/
src/auth/
src/users/
src/projects/
src/tasks/
src/github/
src/ai/
src/webhooks/


---

### Frontend
src/
src/pages/
src/components/
src/features/
src/api/
src/store/


---

## 🧪 MVP Scope Rules

### MUST HAVE
- GitHub login
- Repo import
- Task board
- Auto branch creation
- PR merge → task done
- ONE AI feature

---

### MUST NOT INCLUDE
- GitLab integration
- Teams / collaboration
- Notifications
- Analytics
- CI/CD
- Complex UI
- Mobile app

---

## ✅ Success Criteria

- User can go from idea → branch → PR → done without manual tracking
- Workflow feels faster than GitHub Projects
- Solo developer can use it daily

---

## 🚀 Future Ideas (NOT MVP)

- PR auto-generation
- Commit → task linking
- Progress analytics
- Daily summaries
- AI coding assistant

---

## 🧠 Philosophy

This is NOT a task manager.

This is:
→ a workflow accelerator for developers

Focus on:
- speed
- automation
- simplicity

**use context7 mcp to search documentation for the frameworks and libraries used** 