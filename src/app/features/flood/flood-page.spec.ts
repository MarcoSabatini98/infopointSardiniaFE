import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { FloodPage } from './flood-page';
import { FeedsService } from '../../core/services/feeds.service';

describe('FloodPage', () => {
  it('mostra la testata piena fiumi', async () => {
    await render(FloodPage, {
      providers: [
        {
          provide: FeedsService,
          useValue: { flood: () => of({ available: false, coordinates: { lat: 0, lng: 0 } }) },
        },
      ],
    });
    expect(screen.getByRole('heading', { name: /piena fiumi/i })).toBeTruthy();
  });
});
