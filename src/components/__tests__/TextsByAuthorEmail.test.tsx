import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextsByAuthorEmail } from '../TextsByAuthorEmail';
import { request } from 'graphql-request';

jest.mock('graphql-request');

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('TextsByAuthorEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search form', () => {
    render(<TextsByAuthorEmail />);

    expect(screen.getByText('Search Texts by Author Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter email pattern/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('searches texts when form is submitted', async () => {
    const user = userEvent.setup();
    const mockData = {
      getTextsByAuthorEmail: [
        {
          id: 1,
          content: 'Test content',
          context: 'Test context',
          instructions: 'Test instructions',
          author: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
          },
        },
      ],
    };

    mockRequest.mockResolvedValueOnce(mockData);

    render(<TextsByAuthorEmail />);

    const input = screen.getByPlaceholderText(/Enter email pattern/);
    const button = screen.getByRole('button', { name: 'Search' });

    await user.type(input, '%@example.com');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Found 1 text(s)')).toBeInTheDocument();
    });

    expect(screen.getByText('Text #1')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('displays no results message when no texts found', async () => {
    const user = userEvent.setup();
    const mockData = {
      getTextsByAuthorEmail: [],
    };

    mockRequest.mockResolvedValueOnce(mockData);

    render(<TextsByAuthorEmail />);

    const input = screen.getByPlaceholderText(/Enter email pattern/);
    const button = screen.getByRole('button', { name: 'Search' });

    await user.type(input, '%@nonexistent.com');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('No texts found for this email pattern')).toBeInTheDocument();
    });
  });

  it('displays error message when request fails', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Network error');

    mockRequest.mockRejectedValueOnce(mockError);

    render(<TextsByAuthorEmail />);

    const input = screen.getByPlaceholderText(/Enter email pattern/);
    const button = screen.getByRole('button', { name: 'Search' });

    await user.type(input, '%@example.com');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching', async () => {
    const user = userEvent.setup();
    mockRequest.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ getTextsByAuthorEmail: [] }), 100))
    );

    render(<TextsByAuthorEmail />);

    const input = screen.getByPlaceholderText(/Enter email pattern/);
    const button = screen.getByRole('button', { name: 'Search' });

    await user.type(input, '%@example.com');
    await user.click(button);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});