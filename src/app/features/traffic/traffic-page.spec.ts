import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { TrafficPage } from './traffic-page';
import { FeedsService } from '../../core/services/feeds.service';

describe('TrafficPage', () => {
  it('mostra la testata traffico', async () => {
    await render(TrafficPage, {
      providers: [
        {
          provide: FeedsService,
          useValue: { traffic: () => of({ available: true, count: 0, incidents: [] }) },
        },
      ],
    });
    expect(screen.getByRole('heading', { name: /traffico stradale/i })).toBeTruthy();
  });
});
