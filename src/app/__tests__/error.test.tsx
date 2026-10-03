import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ErrorView from '@/app/error';

describe('Error page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs the error and calls reset when Try again is clicked', async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    const error = new Error('Network failure');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ErrorView error={error} reset={reset} />);

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(error);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
