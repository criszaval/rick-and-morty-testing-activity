import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Pagination from '@/components/Pagination';

describe('Pagination', () => {
  it('disables Previous on the first page and links to the next page', () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Previous/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Next/i })).toHaveAttribute('href', '/?page=2');
  });

  it('shows both navigation links on a middle page', () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    expect(screen.getByRole('link', { name: /Previous/i })).toHaveAttribute('href', '/?page=2');
    expect(screen.getByRole('link', { name: /Next/i })).toHaveAttribute('href', '/?page=4');
  });

  it('disables Next on the final page', () => {
    render(<Pagination currentPage={5} totalPages={5} />);

    expect(screen.getByRole('link', { name: /Previous/i })).toHaveAttribute('href', '/?page=4');
    expect(screen.queryByRole('link', { name: /Next/i })).not.toBeInTheDocument();
  });

  it('disables both controls when only one page exists', () => {
    render(<Pagination currentPage={1} totalPages={1} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });
});
