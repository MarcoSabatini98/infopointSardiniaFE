import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { WeatherPage } from './weather-page';
import { FeedsService } from '../../core/services/feeds.service';

describe('WeatherPage', () => {
  it('mostra la testata meteo', async () => {
    await render(WeatherPage, {
      providers: [{ provide: FeedsService, useValue: { weather: () => of([]) } }],
    });
    expect(screen.getByRole('heading', { name: /meteo sardegna/i })).toBeTruthy();
  });
});
