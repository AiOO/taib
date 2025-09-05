'use client';

import type React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Loader2, Settings, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [context, setContext] = useState('');
  const [instructions, setInstructions] = useState('');
  const [showContextPanel, setShowContextPanel] = useState(false);
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
            context: context.trim() || undefined,
            instructions: instructions.trim() || undefined,
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
    [suggestion, context, instructions],
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

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [suggestion, acceptSuggestion]);

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">AI 텍스트 에디터</h2>
        <button
          onClick={() => setShowContextPanel(!showContextPanel)}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>컨텍스트 & 지시사항</span>
          {showContextPanel ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {showContextPanel && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              컨텍스트 (상황 설명)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="예: 이 텍스트는 블로그 포스트입니다. 기술적인 주제를 다루며 초보자도 이해할 수 있도록 쉽게 설명하는 스타일입니다."
              className="w-full h-20 p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              지시사항 (작성 가이드)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="예: 친근하고 대화하는 톤으로 작성해주세요. 전문 용어를 사용할 때는 간단한 설명을 포함해주세요."
              className="w-full h-20 p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      <CodeMirrorEditor
        value={content}
        suggestion={suggestion?.text}
        onChange={handleTextChange}
        onCursorChange={handleCursorChange}
        onAcceptSuggestion={acceptSuggestion}
      />

      {isLoading && (
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-600">Getting suggestion...</span>
        </div>
      )}

      {suggestion && !isLoading && (
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
          <kbd className="px-2 py-1 text-xs bg-green-100 border border-green-300 rounded text-green-700">
            Tab
          </kbd>
          <span className="text-sm text-green-700">to complete</span>
        </div>
      )}
    </div>
  );
}
