import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AiTextEditor } from '@/components/AiTextEditor';
import '@testing-library/jest-dom';

describe('AiTextEditor', () => {
  it('renders the editor and displays initial text', () => {
    render(<AiTextEditor />);

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveTextContent('안녕하세요,');
  });

  it('renders context panel toggle button', () => {
    render(<AiTextEditor />);

    const toggleButton = screen.getByText('컨텍스트 & 지시사항');
    expect(toggleButton).toBeInTheDocument();
  });

  it('shows context panel when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<AiTextEditor />);

    const toggleButton = screen.getByText('컨텍스트 & 지시사항');
    await user.click(toggleButton);

    expect(screen.getByText('컨텍스트 (상황 설명)')).toBeInTheDocument();
    expect(screen.getByText('지시사항 (작성 가이드)')).toBeInTheDocument();
  });

  it('allows entering context and instructions', async () => {
    const user = userEvent.setup();
    render(<AiTextEditor />);

    const toggleButton = screen.getByText('컨텍스트 & 지시사항');
    await user.click(toggleButton);

    const contextTextarea = screen.getByPlaceholderText(/이 텍스트는 블로그 포스트입니다/);
    const instructionsTextarea = screen.getByPlaceholderText(/친근하고 대화하는 톤으로/);

    await user.type(contextTextarea, 'This is a test context');
    await user.type(instructionsTextarea, 'These are test instructions');

    expect(contextTextarea).toHaveValue('This is a test context');
    expect(instructionsTextarea).toHaveValue('These are test instructions');
  });

  it('hides context panel when toggle button is clicked again', async () => {
    const user = userEvent.setup();
    render(<AiTextEditor />);

    const toggleButton = screen.getByText('컨텍스트 & 지시사항');
    await user.click(toggleButton);

    expect(screen.getByText('컨텍스트 (상황 설명)')).toBeInTheDocument();

    await user.click(toggleButton);

    expect(screen.queryByText('컨텍스트 (상황 설명)')).not.toBeInTheDocument();
  });
});
