# Project: taib

This document provides an overview of the `taib` project, including its structure, commands, and key components.

## Project Overview

`taib` is a Next.js application featuring an AI-powered text editor. It provides text suggestions as the user types, leveraging a custom API endpoint for AI completions.

## Available Scripts

You can run the following commands from the project root:

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Creates a production build of the application.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase using Next.js's ESLint configuration.
- `npm test`: Runs unit tests using Jest.

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── complete/
│   │   │       └── route.ts  # API endpoint for AI suggestions
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main application page
│   └── components/
│       ├── __tests__/
│       │   └── AiTextEditor.test.tsx # Tests for AiTextEditor
│       ├── AiTextEditor.tsx      # Core AI text editor component
│       └── ui/
│           └── SuggestiveTextField.tsx # Reusable suggestion text field
├── jest.config.mjs      # Jest configuration
├── jest.setup.mjs       # Jest setup file
├── next.config.ts       # Next.js configuration
├── package.json         # Project metadata and dependencies
└── tsconfig.json        # TypeScript configuration
```

## Key Components

- **`AiTextEditor.tsx`**: The main feature of this application. It's a text editor that fetches and displays AI-powered suggestions in real-time as the user types. It handles user input, loading states, and suggestion lifecycle (acceptance/rejection).

- **`SuggestiveTextField.tsx`**: A reusable UI component that provides a `contenteditable` input field. It is designed to show inline text suggestions and is the core building block for the `AiTextEditor`.

- **`/api/complete/route.ts`**: A Next.js API route that receives the current text and cursor position. It is responsible for communicating with an AI service to generate a relevant text completion and return it to the client.

## Testing

This project uses **Jest** and **React Testing Library** for unit and component testing.

- **Configuration**: Jest is configured in `jest.config.mjs` and `jest.setup.mjs` to work with Next.js, TypeScript, and path aliases.
- **Test Location**: Test files are located alongside the components they test, inside `__tests__` directories (e.g., `src/components/__tests__`).

### Running Tests

- **Run all tests**:
  ```bash
  npm test
  ```

- **Run a specific test file**:
  To run tests for a single file, pass the path to the test file after `--`. This is useful for focusing on a specific component or feature during development.
  ```bash
  npm test -- <path/to/your/test/file.test.tsx>
  ```
  For example:
  ```bash
  npm test -- src/components/__tests__/AiTextEditor.test.tsx
  ```

## Dependencies

### Main Dependencies
- `next`, `react`, `react-dom`: Core framework.
- `@ai-sdk/react`, `ai`: Vercel AI SDK for integrating AI features.
- `@headlessui/react`: For UI components.
- `lucide-react`: Icon library.

### Development Dependencies
- `jest`, `@testing-library/react`, `ts-jest`: For testing.
- `eslint`, `prettier`: For code linting and formatting.
- `tailwindcss`: For styling.
- `typescript`: For type safety.
