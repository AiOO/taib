'use client';

import React, { memo, useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import {
  EditorView,
  Decoration,
  DecorationSet,
  WidgetType,
  keymap,
} from '@codemirror/view';
import { EditorState, StateField, StateEffect, Prec } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';

class SuggestionWidget extends WidgetType {
  constructor(readonly text: string) {
    super();
  }

  eq(other: SuggestionWidget) {
    return other.text === this.text;
  }

  toDOM() {
    const span = document.createElement('span');
    span.textContent = this.text;
    span.style.opacity = '0.5';
    span.style.pointerEvents = 'none';
    return span;
  }

  ignoreEvent() {
    return true;
  }
}

interface CodeMirrorEditorProps {
  value: string;
  suggestion?: string | null;
  onChange: (value: string) => void;
  onCursorChange: (pos: number) => void;
  onAcceptSuggestion?: () => void;
}

const setSuggestion = StateEffect.define<string | null>();

const suggestionField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);

    for (const e of tr.effects) {
      if (e.is(setSuggestion)) {
        const suggestionText = e.value;
        if (suggestionText) {
          const cursorPos = tr.state.selection.main.head;
          const suggestionDeco = Decoration.widget({
            widget: new SuggestionWidget(suggestionText),
            side: 1,
          });
          decorations = Decoration.set([suggestionDeco.range(cursorPos)]);
        } else {
          decorations = Decoration.none;
        }
      }
    }

    return decorations;
  },
  provide: f => EditorView.decorations.from(f),
});

function CodeMirrorEditor(props: CodeMirrorEditorProps) {
  const { value, suggestion, onChange, onCursorChange, onAcceptSuggestion } = props;
  const editorRef = useRef<{ view: EditorView } | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const view = editorRef.current.view;
      if (view) {
        view.dispatch({
          effects: setSuggestion.of(suggestion ?? null),
        });
      }
    }
  }, [suggestion]);

  const handleStateChange = (state: EditorState) => {
    onCursorChange(state.selection.main.head);
  };

  const customKeymap = Prec.highest(keymap.of([
    {
      key: 'Tab',
      preventDefault: true,
      run: () => {
        if (suggestion && onAcceptSuggestion) {
          onAcceptSuggestion();
          return true;
        }
        return false;
      },
    },
  ]));

  return (
    <CodeMirror
      ref={editorRef}
      value={value}
      onChange={onChange}
      onUpdate={viewUpdate => {
        if (viewUpdate.selectionSet) {
          handleStateChange(viewUpdate.state);
        }
      }}
      theme={isDark ? oneDark : undefined}
      extensions={[suggestionField, EditorView.lineWrapping, customKeymap]}
      height="24rem" // h-96
      className="w-full h-96 p-4 font-mono text-sm rounded-md"
    />
  );
}

export default memo(CodeMirrorEditor);
