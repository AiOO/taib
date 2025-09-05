import { AiTextEditor } from '@/components/AiTextEditor';

export default function Home() {
  return (
    <div className="flex flex-col p-4 gap-4 w-full h-dvh font-sans">
      <main className="w-full flex-1">
        <AiTextEditor />
      </main>
      <footer className="flex justify-center-safe w-full">
        <a
          className="hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          AiOO.ooo
        </a>
      </footer>
    </div>
  );
}
