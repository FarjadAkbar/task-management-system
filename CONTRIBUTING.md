# Contributing to Workflow Sync

Thank you for your interest in contributing to Workflow Sync! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## 🤝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- MongoDB Atlas account (for development)
- Basic knowledge of React, Next.js, and TypeScript

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/FarjadAkbar/workflow-sync
   cd workflow-sync
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

4. **Database Setup**
   ```bash
   npm run generate
   npm run migrate
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔄 Contributing Process

### 1. Choose an Issue

- Look for issues labeled `good first issue` for beginners
- Check `help wanted` for more complex tasks
- Comment on the issue to express interest
- Wait for maintainer approval before starting

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Changes

- Follow the code style guidelines
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass

### 4. Test Your Changes

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Run build
npm run build
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add amazing feature"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper typing
- Use interfaces for object shapes
- Use enums for constants
- Add JSDoc comments for complex functions

```typescript
/**
 * Creates a new task with validation
 * @param data - Task creation data
 * @param userId - ID of the user creating the task
 * @returns Promise resolving to created task
 */
async function createTask(data: CreateTaskDto, userId: string): Promise<Task> {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Use TypeScript interfaces for props
- Keep components small and focused
- Use proper naming conventions

```typescript
interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  // Component implementation
}
```

### File Naming

- Use kebab-case for files: `task-card.tsx`
- Use PascalCase for components: `TaskCard`
- Use camelCase for functions: `createTask`
- Use UPPER_CASE for constants: `API_BASE_URL`

### Folder Structure

```
src/
├── components/
│   ├── ui/                 # Base UI components
│   ├── forms/              # Form components
│   └── features/           # Feature-specific components
│       ├── tasks/
│       │   ├── task-card.tsx
│       │   ├── task-list.tsx
│       │   └── index.ts
│       └── projects/
├── services/               # Business logic
├── repositories/           # Data access
└── types/                  # Type definitions
```

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all new functions
- Test edge cases and error conditions
- Aim for 80%+ code coverage
- Use descriptive test names

```typescript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task with valid data', async () => {
      // Test implementation
    });

    it('should throw error for invalid due date', async () => {
      // Test implementation
    });
  });
});
```

### Integration Tests

- Test API endpoints
- Test database operations
- Test component interactions

### E2E Tests

- Test critical user flows
- Test authentication flows
- Test task management workflows

## 📋 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented code
- [ ] Proper commit messages

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process

1. **Automated Checks** - CI/CD pipeline runs tests
2. **Code Review** - Maintainers review code
3. **Feedback** - Address any requested changes
4. **Approval** - Maintainer approves and merges

## 🐛 Issue Guidelines

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 🏷️ Labels

We use labels to categorize issues and PRs:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority
- `priority: medium` - Medium priority
- `priority: low` - Low priority
- `status: in progress` - Currently being worked on
- `status: blocked` - Blocked by something else

## 📞 Getting Help

- 📧 **Email**: farjadakbar4@gmail.com
- 🐛 **Issues**: Create an issue for bugs or questions

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Community highlights

Thank you for contributing to Workflow Sync! 🚀
