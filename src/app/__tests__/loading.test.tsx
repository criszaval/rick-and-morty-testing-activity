import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loading from '@/app/loading';

describe('Loading', () => {
  it('renders the loading skeleton grid', () => {
    const { container } = render(<Loading />);
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(9);
  });
});
