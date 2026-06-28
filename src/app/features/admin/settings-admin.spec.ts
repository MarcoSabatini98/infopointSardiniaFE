import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { SettingsAdmin } from './settings-admin';
import { SettingsService } from '../../core/services/settings.service';

describe('SettingsAdmin', () => {
  it('mostra le impostazioni caricate', async () => {
    await render(SettingsAdmin, {
      providers: [
        {
          provide: SettingsService,
          useValue: {
            list: () => of([{ key: 'map.default_layer', value: 'weather', description: 'Layer iniziale' }]),
          },
        },
      ],
    });
    expect(screen.getByRole('heading', { name: /impostazioni/i })).toBeTruthy();
    expect(screen.getByText('map.default_layer')).toBeTruthy();
  });
});
