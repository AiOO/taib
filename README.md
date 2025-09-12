# Taib

Type + Tab + AI = taib

This is a simple web-based text editor powered by AI. It provides intelligent code completion suggestions as you type, helping you write code faster and more efficiently.

## Features

*   **AI-Powered Code Completion:** Get real-time code completion suggestions from an AI model.
*   **Context-Aware Suggestions:** Provide context and instructions to the AI to get more relevant suggestions.
*   **Tab to Complete:** Easily accept suggestions by pressing the `Tab` key.
*   **Escape to Dismiss:** Dismiss suggestions with the `Escape` key.
*   **Debounced Suggestions:** Suggestions are fetched automatically after a short period of inactivity.
*   **Built with CodeMirror:** A powerful and extensible code editor component.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Tech Stack

*   [Next.js](https://nextjs.org/) - The React Framework for the Web
*   [React](https://reactjs.org/) - A JavaScript library for building user interfaces
*   [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript
*   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
*   [CodeMirror](https://codemirror.net/) - A versatile text editor implemented in JavaScript for the browser
*   [AI SDK](https://sdk.vercel.ai/) - A library for building AI-powered applications

## Testing

This project uses [Jest](https://jestjs.io/) for unit tests and [Playwright](https://playwright.dev/) for end-to-end tests.

To run the unit tests, use the following command:

```bash
npm test
```

To run the end-to-end tests, use the following command:

```bash
npm run test:e2e
```
