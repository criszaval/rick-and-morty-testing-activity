import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CharacterPage from '@/app/character/[id]/page';
import { getCharacter, getEpisodes } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  getCharacter: vi.fn(),
  getEpisodes: vi.fn(),
}));

const character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: 'Scientist',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://example.com/rick.jpg',
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2',
  ],
  url: '',
  created: '2017-11-04T18:48:46.250Z',
};

const episodes = [
  { id: 1, name: 'Pilot', air_date: 'Dec 2, 2013', episode: 'S01E01' },
  { id: 2, name: 'Lawnmower Dog', air_date: 'Dec 9, 2013', episode: 'S01E02' },
];

describe('Character detail page', () => {
  beforeEach(() => {
    vi.mocked(getCharacter).mockResolvedValue(character as any);
    vi.mocked(getEpisodes).mockResolvedValue(episodes as any);
  });

  it('loads the character and its episodes', async () => {
    render(await CharacterPage({ params: Promise.resolve({ id: '1' }) }));

    expect(getCharacter).toHaveBeenCalledWith('1');
    expect(getEpisodes).toHaveBeenCalledWith(['1', '2']);
    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Scientist')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
    expect(screen.getByText('Episodes (2)')).toBeInTheDocument();
    expect(screen.getByText('S01E01')).toHaveAttribute('title', 'Pilot - Dec 2, 2013');
    expect(screen.getByText('S01E02')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Characters/i })).toHaveAttribute('href', '/');
  });

  it('shows Unknown when character type is empty', async () => {
    vi.mocked(getCharacter).mockResolvedValue({ ...character, type: '' } as any);
    render(await CharacterPage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it.each([
    ['Alive', 'bg-green-500'],
    ['Dead', 'bg-red-500'],
    ['unknown', 'bg-gray-500'],
  ])('renders the correct detail status color for %s', async (status, cssClass) => {
    vi.mocked(getCharacter).mockResolvedValue({ ...character, status } as any);
    const { container } = render(
      await CharacterPage({ params: Promise.resolve({ id: '1' }) }),
    );
    expect(container.querySelector(`.${cssClass}`)).toBeInTheDocument();
  });
});
