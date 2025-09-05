'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import CodeMirrorEditor from '../CodeMirrorEditor';

// Mock CodeMirror dependencies
jest.mock('@uiw/react-codemirror', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CodeMirror = (props: any) => {
    const { value, onChange, onUpdate } = props;

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value);
    };

    const handleSelect = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
      const target = event.target as HTMLTextAreaElement;
      // @ts-ignore
      onUpdate({ state: { selection: { main: { head: target.selectionStart } } } });
    };

    return (
      <textarea
        data-testid="codemirror-textarea"
        value={value}
        onChange={handleChange}
        onSelect={handleSelect}
      />
    );
  };
  return CodeMirror;
});

describe('CodeMirrorEditor', () => {
  it('renders with initial value', () => {
    const handleChange = jest.fn();
    const handleCursorChange = jest.fn();

    render(
      <CodeMirrorEditor
        value="Hello, World!"
        onChange={handleChange}
        onCursorChange={handleCursorChange}
      />,
    );

    const editor = screen.getByTestId('codemirror-textarea');
    expect(editor).toBeInTheDocument();
    // @ts-ignore
    expect(editor.value).toBe('Hello, World!');
  });

  it('displays a suggestion', () => {
    const handleChange = jest.fn();
    const handleCursorChange = jest.fn();

    render(
      <CodeMirrorEditor
        value="Hello, "
        suggestion="World!"
        onChange={handleChange}
        onCursorChange={handleCursorChange}
      />,
    );

    // In our mock, we can't easily test the widget decoration.
    // However, we can ensure the component renders without crashing when a suggestion is provided.
    const editor = screen.getByTestId('codemirror-textarea');
    expect(editor).toBeInTheDocument();
  });
});
