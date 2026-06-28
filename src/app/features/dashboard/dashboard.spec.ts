import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { Dashboard } from './dashboard';
import { FeedsService } from '../../core/services/feeds.service';
import { MapService } from '../../core/services/map.service';

const feedsMock = {
  news: () => of({ sources: [], count: 0, total: 0, items: [] }),
  floods: () => of({ available: true, count: 0, alerts: [] }),
  // usati da SardiniaMap (figlio)
  weather: () => of([]),
  fires: () => of({ available: true, count: 0, fires: [] }),
  flights: () => of({ available: true, count: 0, flights: [] }),
  vessels: () => of({ available: true, count: 0, vessels: [] }),
  traffic: () => of({ available: true, count: 0, incidents: [] }),
};
const mapMock = {
  geojson: () => of({ type: 'FeatureCollection', features: [] }),
  provinces: () => of([]),
  layer: () => of({ count: 0, events: [] }),
  provinceInfo: () => of(null),
};

describe('Dashboard', () => {
  it('renderizza la testata della dashboard', async () => {
    await render(Dashboard, {
      providers: [
        { provide: FeedsService, useValue: feedsMock },
        { provide: MapService, useValue: mapMock },
      ],
    });
    expect(screen.getByRole('heading', { name: /monitoraggio sardegna/i })).toBeTruthy();
  });
});
