# Project: taib

AI-powered text editor built with Next.js that provides real-time text suggestions.

## Available Scripts

- `npm run dev`: Development server with Turbopack
- `npm run build`: Production build  
- `npm run start`: Production server
- `npm run lint`: Code linting
- `npm test`: Unit tests with Jest
- `npm run test:e2e`: End-to-end tests with Playwright

**Important**: When adding new scripts to package.json, update this section in CLAUDE.md

## Project Structure

- `src/app/api/complete/route.ts`: AI completion API endpoint
- `src/components/AiTextEditor.tsx`: Main AI text editor component
- `src/components/ui/CodeMirrorEditor.tsx`: CodeMirror wrapper component
- `e2e/`: E2E test files
- `src/components/__tests__/`: Unit test files

## Testing

### Unit Testing (Jest + React Testing Library)
- Create test files in `__tests__/` directories alongside components
- Run all: `npm test`
- Run specific: `npm test -- <test-file-path>`

### E2E Testing (Playwright) 
- Test files in `e2e/` directory
- Run all: `npm run test:e2e`
- **Important**: When adding/modifying pages, create or update corresponding Playwright tests

## Git Workflow

### Feature Development Process
1. **Create feature branch**: `git checkout -b feature/feature-name`
2. **Make changes**: Implement feature with tests
3. **Commit changes**: Use conventional commit messages
4. **Push branch**: `git push origin feature/feature-name`
5. **Create Pull Request**: Open PR from feature branch to main
6. **Review and merge**: After review, merge PR and delete feature branch

### Commit Message Format
Use conventional commit format:
- `feat:` new features
- `fix:` bug fixes  
- `refactor:` code refactoring
- `test:` adding/updating tests
- `docs:` documentation updates

### Branch Naming
- `feature/description`: New features
- `fix/issue-description`: Bug fixes
- `refactor/description`: Code refactoring

**Important**: Never commit directly to main branch. Always use feature branches and PRs.

## Key Development Rules

- **Components**: Always create unit tests when adding new components
- **Pages**: Always create/update E2E tests when adding/modifying pages  
- **Scripts**: Update CLAUDE.md when adding new npm scripts
- **Tests**: Place unit tests in `__tests__/` directories, E2E tests in `e2e/`
- **Git**: Always use feature branches and PRs, never commit directly to main
