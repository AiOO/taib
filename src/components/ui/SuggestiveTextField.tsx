'use client';

import {
  FormEventHandler,
  memo,
  ReactElement,
  useCallback,
  useRef,
} from 'react';

interface SuggestiveTextFieldProps {
  defaultValue?: string;
  suggestion?: string;
  onChange?: (text: string) => void;
}

function SuggestiveTextField(props: SuggestiveTextFieldProps): ReactElement {
  const { defaultValue, suggestion, onChange } = props;

  const fieldRef = useRef<HTMLSpanElement>(null);

  const handleInput: FormEventHandler<HTMLSpanElement> = useCallback(
    (event) => {
      onChange?.(event.currentTarget.textContent);
    },
    [onChange],
  );

  const handleMouseDown = useCallback(() => {
    const selection = window.getSelection();
    if (
      selection != null &&
      selection.anchorNode?.parentNode?.isSameNode(fieldRef.current)
    ) {
      selection.removeAllRanges();
    } else {
      fieldRef.current?.focus();
    }
  }, []);

  return (
    <div
      className="break-all p-2 w-full h-full cursor-text focus-within:outline-2 focus-within:outline-indigo-600"
      onMouseDown={handleMouseDown}
      tabIndex={-1}
    >
      <span
        ref={fieldRef}
        role="textbox"
        contentEditable="plaintext-only"
        suppressContentEditableWarning
        data-suggestion={suggestion}
        className="suggestive-text-field focus-visible:outline-hidden after:content-[attr(data-suggestion)] after:opacity-50"
        onInput={handleInput}
      >
        {defaultValue ?? '&#200B;'}
      </span>
    </div>
  );
}

export default memo(SuggestiveTextField);
