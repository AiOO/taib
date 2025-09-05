'use client';

import type React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import CodeMirrorEditor from '@/components/ui/CodeMirrorEditor';

interface Suggestion {
  text: string;
  startPos: number;
  endPos: number;
}

export function AiTextEditor() {
  const [content, setContent] = useState('안녕하세요, ');
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getCompletion = useCallback(
    async (text: string, cursorPosition: number) => {
      if (suggestion || cursorPosition === 0) {
        return;
      }

      setIsLoading(true);
      try {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        const response = await fetch('/api/complete', {
          signal: abortController.signal,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            cursorPos: cursorPosition,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get completion');
        }

        const data = await response.json();

        if (data.completion && data.completion.length > 0) {
          setSuggestion({
            text: data.completion,
            startPos: cursorPosition,
            endPos: cursorPosition,
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Error getting completion:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [suggestion],
  );

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (content && !suggestion) {
      debounceTimeoutRef.current = setTimeout(async () => {
        await getCompletion(content, cursorPos);
      }, 250);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [content, cursorPos, suggestion, getCompletion]);

  const handleTextChange = useCallback((value: string) => {
    setContent(value);
    setSuggestion(null);
    abortControllerRef.current?.abort();
  }, []);

  const handleCursorChange = useCallback((pos: number) => {
    setCursorPos(pos);
    if (suggestion) {
      setSuggestion(null);
    }
  }, [suggestion]);

  const acceptSuggestion = useCallback(() => {
    if (suggestion) {
      const newContent =
        content.slice(0, suggestion.startPos) +
        suggestion.text +
        content.slice(suggestion.endPos);
      setContent(newContent);
      setSuggestion(null);
    }
  }, [suggestion, content]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && suggestion) {
        e.preventDefault();
        acceptSuggestion();
      }

      if (e.key === 'Escape' && suggestion) {
        e.preventDefault();
        setSuggestion(null);
      }
    };

    // @ts-ignore
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      // @ts-ignore
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [suggestion, acceptSuggestion]);

  return (
    <div className="space-y-4 relative">
      <CodeMirrorEditor
        value={content}
        suggestion={suggestion?.text}
        onChange={handleTextChange}
        onCursorChange={handleCursorChange}
      />

      {isLoading && (
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-600">Getting suggestion...</span>
        </div>
      )}
    </div>
  );
}
