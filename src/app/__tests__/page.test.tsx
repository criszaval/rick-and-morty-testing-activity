import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Home from '@/app/page';
import { getCharacters } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  getCharacters: vi.fn(),
}));

vi.mock('@/components/CharacterCard', () => ({
  default: ({ character }: any) => <div data-testid="character-card">{character.name}</div>,
}));

vi.mock('@/components/Pagination', () => ({
  default: ({ currentPage, totalPages }: any) => (
    <div data-testid="pagination">{currentPage}/{totalPages}</div>
  ),
}));

const response = {
  info: { count: 2, pages: 5, next: null, prev: null },
  results: [
    { id: 1, name: 'Rick Sanchez' },
    { id: 2, name: 'Morty Smith' },
  ],
};

describe('Home page', () => {
  beforeEach(() => {
    vi.mocked(getCharacters).mockResolvedValue(response as any);
  });

  it('loads page 1 when no page query is provided', async () => {
    render(await Home({ searchParams: Promise.resolve({}) }));

    expect(getCharacters).toHaveBeenCalledWith(1);
    expect(screen.getByText('Rick and Morty Characters')).toBeInTheDocument();
    expect(screen.getAllByTestId('character-card')).toHaveLength(2);
    expect(screen.getByTestId('pagination')).toHaveTextContent('1/5');
  });

  it('uses the page query string when provided', async () => {
    render(await Home({ searchParams: Promise.resolve({ page: '3' }) }));
    expect(getCharacters).toHaveBeenCalledWith(3);
    expect(screen.getByTestId('pagination')).toHaveTextContent('3/5');
  });

  it('falls back to page 1 when page is not a string', async () => {
    render(await Home({ searchParams: Promise.resolve({ page: ['2'] }) }));
    expect(getCharacters).toHaveBeenCalledWith(1);
  });
});
