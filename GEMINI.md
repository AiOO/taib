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

## Key Development Rules

- **Components**: Always create unit tests when adding new components
- **Pages**: Always create/update E2E tests when adding/modifying pages  
- **Scripts**: Update CLAUDE.md when adding new npm scripts
- **Tests**: Place unit tests in `__tests__/` directories, E2E tests in `e2e/`
