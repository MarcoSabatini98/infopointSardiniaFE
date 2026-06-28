import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { FiresPage } from './fires-page';
import { FeedsService } from '../../core/services/feeds.service';

describe('FiresPage', () => {
  it('mostra la testata incendi e lo stato vuoto', async () => {
    await render(FiresPage, {
      providers: [
        { provide: FeedsService, useValue: { fires: () => of({ available: true, count: 0, fires: [] }) } },
      ],
    });
    expect(screen.getByRole('heading', { name: /incendi attivi/i })).toBeTruthy();
    expect(screen.getByText(/nessun incendio/i)).toBeTruthy();
  });
});
