import { TextsByAuthorEmail } from '@/components/TextsByAuthorEmail';

export default function TextsPage() {
  return (
    <div className="flex flex-col p-4 gap-4 w-full min-h-dvh font-sans">
      <main className="w-full flex-1">
        <TextsByAuthorEmail />
      </main>
      <footer className="flex justify-center-safe w-full">
        <a
          className="hover:underline hover:underline-offset-4"
          href="/"
        >
          ← Back to Home
        </a>
      </footer>
    </div>
  );
}