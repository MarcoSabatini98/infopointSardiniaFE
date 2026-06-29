import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { WeatherPage } from './weather-page';
import { FeedsService } from '../../core/services/feeds.service';

const feedsMock = {
  weather: (code?: string) =>
    of(code ? { coordinates: { lat: 0, lng: 0 }, current: null, daily: null, hourly: null } : []),
  floods: () => of({ available: true, count: 0, alerts: [] }),
  searchWeather: () => of({ coordinates: { lat: 0, lng: 0 }, current: null }),
  air: () => of({ coordinates: { lat: 0, lng: 0 }, current: null, aqi_label: null }),
};

describe('WeatherPage', () => {
  it('mostra la testata meteo e la barra di ricerca', async () => {
    await render(WeatherPage, {
      providers: [{ provide: FeedsService, useValue: feedsMock }],
    });
    expect(screen.getByRole('heading', { name: /meteo sardegna/i })).toBeTruthy();
    expect(screen.getByPlaceholderText(/cerca una citt/i)).toBeTruthy();
  });
});
