import { render, screen } from '@testing-library/react';
import { AiTextEditor } from '@/components/AiTextEditor';
import '@testing-library/jest-dom';

describe('AiTextEditor', () => {
  it('renders the editor and displays initial text', () => {
    render(<AiTextEditor />);

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveTextContent('안녕하세요,');
  });
});
