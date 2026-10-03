import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CharacterCard from '@/components/CharacterCard';
import type { Character } from '@/types/rickandmorty';

const baseCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://example.com/rick.jpg',
  episode: [],
  url: '',
  created: '2017-11-04T18:48:46.250Z',
};

describe('CharacterCard', () => {
  it('renders the character information and detail link', () => {
    render(<CharacterCard character={baseCharacter} />);

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/character/1');
    expect(screen.getByAltText('Rick Sanchez')).toHaveAttribute(
      'src',
      'https://example.com/rick.jpg',
    );
  });

  it.each([
    ['Alive', 'bg-green-500'],
    ['Dead', 'bg-red-500'],
    ['unknown', 'bg-gray-500'],
  ] as const)('uses the correct status color for %s', (status, cssClass) => {
    const { container } = render(
      <CharacterCard character={{ ...baseCharacter, status }} />,
    );
    expect(container.querySelector(`.${cssClass}`)).toBeInTheDocument();
  });

  it('falls back to gray for an unexpected runtime status', () => {
    const character = { ...baseCharacter, status: 'Missing' } as unknown as Character;
    const { container } = render(<CharacterCard character={character} />);
    expect(container.querySelector('.bg-gray-500')).toBeInTheDocument();
  });
});
