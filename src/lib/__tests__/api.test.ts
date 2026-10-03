import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCharacter, getCharacters, getEpisodes } from '@/lib/api';

describe('Rick and Morty API client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getCharacters returns the requested page', async () => {
    const payload = { info: { pages: 2 }, results: [{ id: 1, name: 'Rick' }] };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as Response);

    await expect(getCharacters(2)).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?page=2',
    );
  });

  it('getCharacters defaults to page 1', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ info: {}, results: [] }),
    } as Response);

    await getCharacters();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?page=1',
    );
  });

  it('getCharacters throws when the request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response);
    await expect(getCharacters()).rejects.toThrow('Failed to fetch characters');
  });

  it('getCharacter returns character details', async () => {
    const character = { id: 1, name: 'Rick Sanchez' };
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => character,
    } as Response);

    await expect(getCharacter('1')).resolves.toEqual(character);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/1',
    );
  });

  it('getCharacter throws when the request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response);
    await expect(getCharacter('999')).rejects.toThrow(
      'Failed to fetch character details',
    );
  });

  it('getEpisodes returns an empty array without calling fetch when no ids exist', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    await expect(getEpisodes([])).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('getEpisodes converts a single episode object into an array', async () => {
    const episode = { id: 1, name: 'Pilot', episode: 'S01E01' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => episode,
    } as Response);

    await expect(getEpisodes(['1'])).resolves.toEqual([episode]);
  });

  it('getEpisodes preserves an episode array returned by the API', async () => {
    const episodes = [
      { id: 1, name: 'Pilot', episode: 'S01E01' },
      { id: 2, name: 'Lawnmower Dog', episode: 'S01E02' },
    ];
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => episodes,
    } as Response);

    await expect(getEpisodes(['1', '2'])).resolves.toEqual(episodes);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/episode/1,2',
    );
  });

  it('getEpisodes throws when the request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response);
    await expect(getEpisodes(['1'])).rejects.toThrow('Failed to fetch episodes');
  });
});
