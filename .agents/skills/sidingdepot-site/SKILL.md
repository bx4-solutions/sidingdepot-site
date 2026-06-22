```markdown
# sidingdepot-site Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `sidingdepot-site` repository, a TypeScript project built with the Vite framework. You'll learn how to structure files, write and commit code, and follow the project's conventions for maintainable and consistent development.

## Coding Conventions

### File Naming
- Use **camelCase** for all file and directory names.
  - Example: `userProfile.ts`, `orderHistory.test.ts`

### Import Style
- Use **alias imports** for modules.
  - Example:
    ```typescript
    import { getUser } from '@/services/userService';
    ```

### Export Style
- Use **named exports**.
  - Example:
    ```typescript
    // userService.ts
    export function getUser(id: string) { ... }
    ```

### Commit Messages
- Follow **Conventional Commits** with the `feat` prefix for features.
- Average commit message length: ~84 characters.
  - Example:
    ```
    feat: add user profile component with basic info and avatar upload
    ```

## Workflows

### Feature Development
**Trigger:** When implementing a new feature  
**Command:** `/feature-development`

1. Create a new branch for your feature.
2. Write code following the file naming, import, and export conventions.
3. Add or update tests in files matching `*.test.*`.
4. Commit changes using the `feat` prefix and a descriptive message.
5. Open a pull request for review.

### Code Testing
**Trigger:** Before pushing or merging changes  
**Command:** `/run-tests`

1. Identify or create test files using the `*.test.*` pattern.
2. Run the test suite (framework unknown; typically `npm test` or similar).
3. Ensure all tests pass before merging.

## Testing Patterns

- Test files use the `*.test.*` naming convention (e.g., `userService.test.ts`).
- The specific testing framework is not detected; check project scripts or documentation for details.
- Place tests alongside the modules they cover or in a dedicated `tests` directory.

## Commands
| Command              | Purpose                                         |
|----------------------|-------------------------------------------------|
| /feature-development | Guide for starting and submitting new features  |
| /run-tests           | Steps to run and verify tests before merging    |
```
