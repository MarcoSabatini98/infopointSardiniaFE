import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { FeedsService } from '../../core/services/feeds.service';
import { MapService } from '../../core/services/map.service';
import { ProvinceCode } from '../../core/models/province.models';
import {
  FiresResponse,
  FlightsResponse,
  TrafficResponse,
  VesselsResponse,
  WeatherProvince,
} from '../../core/models/feeds.models';
import { MapEvent } from '../../core/models/event.models';
import { GeoLayer, LAYERS, weatherInfo, windDir } from './map-layers';

const SARDINIA_CENTER: L.LatLngTuple = [40.05, 9.05];
const num = (v: number | null | undefined, suffix = '') =>
  v == null ? '–' : `${Math.round(v)}${suffix}`;

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

// Marker a icona: cerchio bianco bordato col colore del layer + emoji. Stili
// inline perché Leaflet crea il DOM fuori dall'incapsulamento del componente.
function pin(emoji: string, color: string): L.DivIcon {
  const size = 32;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;display:grid;place-items:center;background:#fff;border:2px solid ${color};box-shadow:0 1px 5px rgba(20,30,30,.35);font-size:16px;line-height:1;">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
  });
}

@Component({
  selector: 'app-sardinia-map',
  template: `<div class="map" #mapEl></div>`,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
      .map {
        height: 100%;
        min-height: 460px;
        border-radius: var(--radius);
        overflow: hidden;
      }
    `,
  ],
})
export class SardiniaMap implements AfterViewInit, OnDestroy {
  private readonly feeds = inject(FeedsService);
  private readonly mapService = inject(MapService);

  // Layer attivo + provincia selezionata, controllati dal dashboard.
  readonly layer = input<GeoLayer>('weather');
  readonly selected = input<ProvinceCode | null>(null);
  readonly provinceSelected = output<ProvinceCode>();
  readonly layerStats = output<{ count: number | null; loading: boolean }>();

  private readonly mapEl = viewChild.required<ElementRef<HTMLDivElement>>('mapEl');
  private map!: L.Map;
  private provinceLayer = L.layerGroup();
  private dataLayer = L.layerGroup();
  private geoLayer?: L.GeoJSON;
  private ready = false;

  constructor() {
    // Reagisce ai cambi di layer dal selettore (dopo che la mappa è pronta).
    effect(() => {
      const l = this.layer();
      if (this.ready) this.loadLayer(l);
    });
    // Ristila i poligoni quando cambia la provincia selezionata (dal toggle o
    // dal click sulla mappa).
    effect(() => {
      this.selected();
      if (this.ready) this.geoLayer?.setStyle((f) => this.provinceStyle(f?.properties?.['code']));
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapEl().nativeElement, { center: SARDINIA_CENTER, zoom: 8 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(this.map);
    this.provinceLayer.addTo(this.map);
    this.dataLayer.addTo(this.map);
    this.ready = true;
    this.loadProvinces();
    this.loadLayer(this.layer());
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  // ── Province: outline discreto, cliccabile ──────────────────
  private loadProvinces(): void {
    this.mapService.geojson().subscribe((fc) => {
      this.geoLayer = L.geoJSON(fc, {
        style: (f) => this.provinceStyle(f?.properties?.['code']),
        onEachFeature: (feature, lyr) => {
          const code = feature.properties?.['code'] as ProvinceCode;
          const name = feature.properties?.['name'] as string;
          lyr.bindTooltip(name, { sticky: true });
          lyr.on('click', () => this.provinceSelected.emit(code));
          lyr.on('mouseover', () => {
            if (code !== this.selected()) (lyr as L.Path).setStyle({ fillOpacity: 0.15 });
          });
          lyr.on('mouseout', () => {
            if (code !== this.selected()) (lyr as L.Path).setStyle(this.provinceStyle(code));
          });
        },
      }).addTo(this.provinceLayer);
      const bounds = this.geoLayer.getBounds();
      if (bounds.isValid()) this.map.fitBounds(bounds, { padding: [20, 20] });
    });
  }

  private provinceStyle(code?: string): L.PathOptions {
    const isSel = code === this.selected();
    return {
      color: isSel ? '#c1502e' : '#0b6e75',
      weight: isSel ? 2.5 : 1,
      fillColor: isSel ? '#c1502e' : '#0b6e75',
      fillOpacity: isSel ? 0.14 : 0.04,
    };
  }

  // ── Layer dati: marker a icona per tipo ─────────────────────
  private loadLayer(layer: GeoLayer): void {
    if (!this.map) return;
    this.layerStats.emit({ count: null, loading: true });
    this.dataLayer.clearLayers();
    const def = LAYERS.find((l) => l.id === layer)!;
    const done = (n: number) => this.layerStats.emit({ count: n, loading: false });

    switch (layer) {
      case 'weather':
        this.feeds.weather().subscribe((d) => {
          const arr = (Array.isArray(d) ? d : [d]) as WeatherProvince[];
          arr.forEach((w) => this.weatherMarker(w));
          done(arr.length);
        });
        break;
      case 'fires':
        this.feeds.fires().subscribe((d: FiresResponse) => {
          d.fires.forEach((f) =>
            this.marker(f.lat, f.lng, def, [
              ['Incendio attivo', true],
              [`Fonte: ${f.source}`],
              [f.acquired_at ? `Rilevato: ${f.acquired_at}` : ''],
            ]),
          );
          done(d.count);
        });
        break;
      case 'flights':
        this.feeds.flights().subscribe((d: FlightsResponse) => {
          d.flights.forEach((f) =>
            this.marker(f.lat, f.lng, def, [
              [f.callsign || f.icao24, true],
              [f.origin_country ?? ''],
              [`Quota ${num(f.geo_altitude, ' m')} · ${num(f.velocity, ' m/s')}`],
            ]),
          );
          done(d.count);
        });
        break;
      case 'vessels':
        this.feeds.vessels().subscribe((d: VesselsResponse) => {
          d.vessels.forEach((v) =>
            this.marker(v.lat, v.lng, def, [
              [v.name || `MMSI ${v.mmsi}`, true],
              [v.sog != null ? `Velocità ${v.sog} kn` : ''],
              [v.heading != null ? `Rotta ${v.heading}°` : ''],
            ]),
          );
          done(d.count);
        });
        break;
      case 'traffic':
        this.feeds.traffic().subscribe((d: TrafficResponse) => {
          d.incidents.forEach((i) => {
            const c = firstCoord(i.geometry);
            if (c)
              this.marker(c[1], c[0], def, [
                [i.category, true],
                [i.description ?? ''],
                [i.road_numbers?.length ? `Strada: ${i.road_numbers.join(', ')}` : ''],
              ]);
          });
          done(d.count);
        });
        break;
      case 'events':
        this.mapService.layer<{ count: number; events: MapEvent[] }>('events').subscribe((d) => {
          (d.events ?? []).forEach((e) =>
            this.marker(e.lat, e.lng, def, [
              [e.title, true],
              [`${e.category}${e.comune ? ' · ' + e.comune : ''}`],
              [e.date ? `${e.date}` : ''],
              [e.source ? `Fonte: ${e.source}` : ''],
            ]),
          );
          done(d.events?.length ?? 0);
        });
        break;
    }
  }

  // Marker generico a icona con popup multi-riga ([testo, bold?]).
  private marker(
    lat: number | null,
    lng: number | null,
    def: { icon: string; color: string },
    lines: [string, boolean?][],
  ): void {
    if (lat == null || lng == null) return;
    const html = lines
      .filter(([t]) => t)
      .map(([t, bold]) => (bold ? `<strong>${escapeHtml(t)}</strong>` : escapeHtml(t)))
      .join('<br>');
    L.marker([lat, lng], { icon: pin(def.icon, def.color) })
      .bindPopup(html)
      .addTo(this.dataLayer);
  }

  private weatherMarker(w: WeatherProvince): void {
    if (!w.coordinates) return;
    const def = LAYERS.find((l) => l.id === 'weather')!;
    const c = w.current;
    const wi = weatherInfo(c?.weather_code, c?.is_day);
    const min = w.daily?.temperature_2m_min?.[0];
    const max = w.daily?.temperature_2m_max?.[0];
    const html = [
      `<strong>${escapeHtml(w.province.name)}</strong>`,
      `${wi.icon} ${wi.label}`,
      `🌡️ ${num(c?.temperature_2m, '°')} (perc. ${num(c?.apparent_temperature, '°')})`,
      `💧 ${num(c?.relative_humidity_2m, '%')} · 💨 ${num(c?.wind_speed_10m, ' km/h')} ${windDir(c?.wind_direction_10m)}`,
      min != null || max != null ? `Oggi ${num(min, '°')} / ${num(max, '°')}` : '',
      c?.precipitation ? `Precip. ${c.precipitation} mm` : '',
    ]
      .filter(Boolean)
      .join('<br>');
    // Icona meteo dinamica (per codice) invece dell'emoji generica del layer.
    L.marker([w.coordinates.lat, w.coordinates.lng], { icon: pin(wi.icon, def.color) })
      .bindPopup(html)
      .addTo(this.dataLayer);
  }
}

// Coordinata rappresentativa [lng,lat] da una geometria GeoJSON.
function firstCoord(geometry: unknown): [number, number] | null {
  const g = geometry as { coordinates?: unknown } | null;
  if (!g || !g.coordinates) return null;
  let c: unknown = g.coordinates;
  while (Array.isArray(c) && Array.isArray(c[0])) c = c[0];
  return Array.isArray(c) && typeof c[0] === 'number' && typeof c[1] === 'number'
    ? [c[0], c[1]]
    : null;
}
