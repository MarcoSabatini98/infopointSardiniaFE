import { render } from '@testing-library/angular';
import { of } from 'rxjs';
import { describe, it, expect } from 'vitest';
import { SardiniaMap } from './sardinia-map';
import { FeedsService } from '../../core/services/feeds.service';
import { MapService } from '../../core/services/map.service';

const feedsMock = {
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
};

describe('SardiniaMap', () => {
  it('inizializza il contenitore mappa', async () => {
    const { container } = await render(SardiniaMap, {
      providers: [
        { provide: FeedsService, useValue: feedsMock },
        { provide: MapService, useValue: mapMock },
      ],
    });
    expect(container.querySelector('.map')).toBeTruthy();
  });
});
