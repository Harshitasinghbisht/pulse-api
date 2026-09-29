# Pulse API

**Pulse API** is a backend API workspace built for creating, organizing, and managing API requests in a collaborative workspace.

The project is inspired by tools like Postman, but is built from scratch to understand how an API development platform works internally — including authentication, workspace permissions, team collaboration, collections, and request management.

> **Status:** In active development

---

## Features

### Authentication

* User registration and email verification
* Login and logout
* JWT-based authentication
* HTTP-only cookie authentication
* Forgot password flow
* Reset password flow
* Protected routes
* `GET /me` for authenticated user details

### Workspaces

Users can create and manage workspaces for organizing their API development work.

Workspace roles:

* **OWNER**
* **ADMIN**
* **EDITOR**
* **VIEWER**

Permissions are enforced at the workspace level using role-based authorization.

### Workspace Collaboration

* Invite users to a workspace
* Assign a role while inviting
* Accept workspace invitations
* Decline invitations
* Remove workspace members
* Prevent duplicate memberships
* Invitation expiration
* Transaction-based invitation handling

### Collections

Collections are used to organize API requests inside a workspace.

Current collection functionality includes:

* Create collections
* View workspace collections
* Update collections
* Delete collections
* Unique collection names within a workspace
* Permission-based collection access

Collection permissions:

| Action | Owner | Admin | Editor | Viewer |
| ------ | :---: | :---: | :----: | :----: |
| View   |   ✓   |   ✓   |    ✓   |    ✓   |
| Create |   ✓   |   ✓   |    —   |    —   |
| Update |   ✓   |   ✓   |    ✓   |    —   |
| Delete |   ✓   |   ✓   |    —   |    —   |

### Requests

The request module is being developed to allow users to save and organize API requests inside collections.

Planned request data includes:

* Request name
* HTTP method
* URL
* Headers
* Query parameters
* Request body
* Authentication configuration
* Collection
* Folder
* Creator

---

## Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **JavaScript**
* **Prisma ORM**

### Database

* **PostgreSQL**
* **Neon**

### Authentication & Security

* **JWT**
* **HTTP-only cookies**
* Role-Based Access Control (RBAC)
* Email verification
* Password reset tokens

### Development Tools

* **Git & GitHub**
* **Postman**
* **VS Code**
* **npm**

---

## Architecture

Pulse API follows a modular backend structure where authentication, workspace management, collections, and other features are separated into their own modules.

```text
pulse-api/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── ...
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

The exact structure may evolve as more modules are added.

---

## Authentication Flow

Pulse API uses JWT-based authentication with HTTP-only cookies.

```text
Register
   │
   ▼
Email Verification
   │
   ▼
Login
   │
   ▼
JWT Cookie
   │
   ▼
Protected API Routes
   │
   ▼
Authorization / RBAC
```

Protected routes first authenticate the user and then check whether the user has permission to perform the requested action.

---

## Workspace Authorization

Authorization is handled using workspace roles.

```text
User
 │
 ▼
Workspace Membership
 │
 ├── OWNER
 ├── ADMIN
 ├── EDITOR
 └── VIEWER
       │
       ▼
  Action Permission
```

Instead of checking roles directly inside every controller, the project uses reusable workspace authorization middleware.

This makes permission checks easier to maintain as new workspace features are added.

---

## Database Relationships

The main entities currently revolve around:

```text
User
 │
 ├── Workspace Membership
 │          │
 │          ▼
 │      Workspace
 │          │
 │          └── Collection
 │
 └── Invitations
```

Collections belong to a workspace, while workspace members determine what actions a user can perform.

---

## Environment Variables

Create a `.env` file inside the backend directory.

```env
DATABASE_URL="your_neon_postgresql_connection_string"

JWT_SECRET="your_jwt_secret"

RESEND_API_KEY="your_resend_api_key"

CLIENT_URL="http://localhost:3000"
```

> Never commit your `.env` file or expose secret keys in the repository.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Harshitasinghbisht/pulse-api.git
```

### 2. Move into the backend

```bash
cd pulse-api/backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and add the required variables.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run database migrations

```bash
npx prisma migrate dev
```

### 7. Start the development server

```bash
npm run dev
```

The API will then be available on your configured local port.

---

## API Modules

| Module                   | Status         |
| ------------------------ | -------------- |
| Authentication           | Completed      |
| Email Verification       | Completed      |
| Password Reset           | Completed      |
| Workspace Management     | Completed      |
| Workspace Invitations    | Completed      |
| Workspace RBAC           | Completed      |
| Collections              | Completed      |
| Requests                 | In Development |
| Folders                  | Planned        |
| Environments / Variables | Planned        |
| API Execution            | Planned        |
| Request History          | Planned        |
| Monitoring               | Planned        |

---

## What I Learned

Building Pulse API has mainly been about understanding backend systems beyond basic CRUD.

Some of the concepts explored while building the project:

* JWT authentication
* HTTP-only cookies
* Role-Based Access Control
* Middleware-based authorization
* Database relationships
* Prisma ORM
* PostgreSQL
* Compound unique constraints
* Database transactions
* Workspace-level permissions
* Invitation lifecycle management
* API design
* Error handling
* Authentication and authorization boundaries

One important backend problem I worked through was handling workspace invitations safely using database transactions and unique constraints to avoid duplicate memberships and inconsistent states.

---

## Roadmap

The project is still being developed.

### Request Management

* [ ] Create requests
* [ ] Update requests
* [ ] Delete requests
* [ ] Store headers
* [ ] Store query parameters
* [ ] Store request body
* [ ] Request authentication

### Organization

* [ ] Folders
* [ ] Nested folders
* [ ] Request variables
* [ ] Environment variables

### API Development Features

* [ ] Execute saved requests
* [ ] Request history
* [ ] Response storage
* [ ] API documentation generation
* [ ] Import/export collections

### Collaboration

* [ ] Real-time workspace updates
* [ ] Activity logs
* [ ] Better invitation management
* [ ] Team-level request collaboration

### Future Ideas

* [ ] AI-assisted API documentation
* [ ] AI-generated request examples
* [ ] API monitoring
* [ ] Request performance insights

---

## Why I Built This

I wanted to build something that goes beyond a simple CRUD application.

Instead of building another basic authentication + CRUD project, I wanted to understand how a real developer tool handles:

* authentication
* authorization
* team permissions
* data ownership
* database relationships
* collaboration
* API organization

Pulse API is my attempt to build those pieces from scratch while learning how backend systems are designed in real applications.

---

## Author

**Harshita Bisht**

B.Tech Computer Science
Backend / MERN Developer

* GitHub: [@Harshitasinghbisht](https://github.com/Harshitasinghbisht)
* LinkedIn: [Harshita Bisht](https://linkedin.com/in/bishtharshita/)

---

## License

This project is currently for learning and portfolio purposes.
