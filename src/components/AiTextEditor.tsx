'use client';

import type React from 'react';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
} from 'react';
import { Loader2 } from 'lucide-react';
import SuggestiveTextField from '@/components/ui/SuggestiveTextField';

interface Suggestion {
  text: string;
  startPos: number;
  endPos: number;
}

export function AiTextEditor() {
  const [content, setContent] = useState(' ');
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldTriggerDebounceRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getCompletion = useCallback(
    async (text: string, cursorPosition: number) => {
      // Don't generate suggestions if there's already one or if we're at the very beginning
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

  // Trigger debounce when shouldTriggerDebounce flag is set
  const triggerDebounce = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (content && !suggestion) {
      debounceTimeoutRef.current = setTimeout(async () => {
        await getCompletion(content, cursorPos);
      }, 250);
    }
  }, [content, cursorPos, suggestion, getCompletion]);

  // Watch for when we should trigger debounce
  useEffect(() => {
    if (shouldTriggerDebounceRef.current) {
      triggerDebounce();
      shouldTriggerDebounceRef.current = false;
    }
  }, [content, triggerDebounce]);

  const handleTextChange = useCallback((value: string) => {
    setContent(value);
    setCursorPos(value.length);
    setSuggestion((currentValue) =>
      currentValue != null ? null : currentValue,
    );
    abortControllerRef.current?.abort();
    shouldTriggerDebounceRef.current = true;
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab' && suggestion) {
        e.preventDefault();
        acceptSuggestion();
        return;
      }

      if (e.key === 'Escape' && suggestion) {
        e.preventDefault();
        rejectSuggestion();
        return;
      }

      if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown'
      ) {
        // Clear suggestion on arrow key navigation
        if (suggestion) {
          setSuggestion(null);
        }
        return;
      }

      // For any typing keys (letters, numbers, space, etc.), set flag to trigger debounce
      if (
        e.key.length === 1 || // Single character keys
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.key === 'Enter'
      ) {
        shouldTriggerDebounceRef.current = true;
      }
    },
    [suggestion],
  );

  const handleCursorChange = useCallback(() => {
    if (textareaRef.current) {
      const newCursorPos = textareaRef.current.selectionStart;
      setCursorPos(newCursorPos);

      // Clear suggestion if cursor moved
      if (suggestion) {
        setSuggestion(null);
      }
    }
  }, [suggestion]);

  const acceptSuggestion = useCallback(() => {
    if (suggestion && textareaRef.current) {
      const newContent =
        content.slice(0, suggestion.startPos) +
        suggestion.text +
        content.slice(suggestion.endPos);
      const newCursorPos = suggestion.startPos + suggestion.text.length;

      setContent(newContent);
      setSuggestion(null);

      // Set cursor position after the inserted text
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          textareaRef.current.focus();
          setCursorPos(newCursorPos);
        }
      }, 0);
    }
  }, [suggestion, content]);

  const rejectSuggestion = useCallback(() => {
    setSuggestion(null);
    textareaRef.current?.focus();
  }, []);

  // const displayText = suggestion
  //   ? content.slice(0, suggestion.startPos) +
  //     content.slice(suggestion.startPos, suggestion.endPos) +
  //     suggestion.text +
  //     content.slice(suggestion.endPos)
  //   : content;

  /*
    <textarea
      ref={textareaRef}
      onKeyDown={handleKeyDown}
      onSelect={handleCursorChange}
      onClick={handleCursorChange}
      placeholder="Start typing... AI suggestions will appear automatically"
      className={`w-full h-96 p-4 font-mono text-sm resize-none border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        suggestion ? 'relative z-20 bg-transparent' : 'bg-white'
      }`}
      style={
        suggestion ? { color: 'transparent', caretColor: 'black' } : {}
      }
    />
   */

  return (
    <div className="space-y-4">
      {/* Editor */}
      <SuggestiveTextField
        defaultValue="안녕하세요, "
        suggestion={suggestion?.text}
        onChange={handleTextChange}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-600">Getting suggestion...</span>
        </div>
      )}
    </div>
  );
}
