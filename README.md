# 🔄 WorkSync - Team Task Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.2.1-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive team task management platform built with Next.js, featuring real-time collaboration, project management, team chat, file sharing, and calendar integration.

## ✨ Features

### 🎯 **Project Management**
- **Kanban Boards** - Visual task organization with drag-and-drop
- **Sprint Planning** - Agile project management with sprints
- **Task Hierarchy** - Subtasks and parent-child relationships
- **Progress Tracking** - Real-time project analytics and reporting

### 👥 **Team Collaboration**
- **Real-time Chat** - Team messaging with file attachments
- **User Management** - Role-based access control
- **Team Roles** - Developer, Designer, Manager, SEO, Content Writer
- **Activity Feeds** - Track team activities and updates

### 📁 **File Management**
- **File Sharing** - Secure file upload and sharing
- **Document Viewer** - Built-in document preview
- **Folder Organization** - Hierarchical file structure
- **Version Control** - File version management

### 📅 **Calendar & Events**
- **Google Calendar Integration** - Sync with Google Calendar
- **Event Management** - Create and manage team events
- **Meeting Scheduler** - Automated meeting coordination
- **Availability Tracking** - Team availability management

### 🎫 **Support System**
- **Ticket Management** - IT support ticket system
- **Priority Levels** - Urgent, High, Medium, Low priorities
- **Status Tracking** - Open, In Progress, Resolved, Closed
- **Auto-assignment** - Automatic ticket routing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Google Cloud Console account (for calendar integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FarjadAkbar/worksync
   cd worksync
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/worksync"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google Calendar
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # File Upload
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"
   
   # Email
   SMTP_HOST="your-smtp-host"
   SMTP_PORT="587"
   SMTP_USER="your-smtp-user"
   SMTP_PASS="your-smtp-password"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run generate
   
   # Push schema to database
   npm run migrate
   
   # Seed database (optional)
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main application pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── dashboard/        # Feature-specific components
│   └── modals/           # Modal components
├── lib/                  # Utilities and configurations
├── services/             # Business logic layer
├── repositories/         # Data access layer
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
└── store/               # State management
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **File Upload**: UploadThing
- **Calendar**: Google Calendar API
- **Email**: Nodemailer
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod

## 📖 API Documentation

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Tasks
- `GET /api/tasks` - List tasks with filters
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get task details
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Chat
- `GET /api/chat/rooms` - List chat rooms
- `POST /api/chat/rooms` - Create chat room
- `GET /api/chat/rooms/[id]` - Get room messages
- `POST /api/chat/messages` - Send message

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before getting started.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

## 🐛 Bug Reports

Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

## 💡 Feature Requests

Have an idea? We'd love to hear it! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Mockups or examples if possible

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://www.prisma.io/) for the database toolkit
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vercel](https://vercel.com/) for deployment platform

## 📞 Support

- 📧 Email: farjadakbar4@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/FarjadAkbar/worksync/issues)

---

<div align="center">
  <strong>Made with ❤️ by Farjad Akbar</strong>
</div>