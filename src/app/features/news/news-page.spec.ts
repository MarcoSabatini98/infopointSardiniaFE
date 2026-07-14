import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { NewsPage } from './news-page';
import { FeedsService } from '../../core/services/feeds.service';

describe('NewsPage', () => {
  it('mostra la testata del giornale', async () => {
    await render(NewsPage, {
      providers: [
        {
          provide: FeedsService,
          useValue: { news: () => of({ sources: [], count: 0, total: 0, items: [] }) },
        },
      ],
    });
    expect(screen.getByRole('heading', { name: /cronaca sarda/i })).toBeTruthy();
  });
});
