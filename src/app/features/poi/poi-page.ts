import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { FeedsService } from '../../core/services/feeds.service';
import { Poi, PoiResponse } from '../../core/models/feeds.models';
import { PROVINCES, ProvinceCode } from '../../core/models/province.models';

// Allineato all'enum ?tipo= del backend (+ "" = tutti).
const POI_TYPES: { value: string; label: string }[] = [
  { value: '', label: 'Tutti i tipi' },
  { value: 'information', label: 'Info turistiche' },
  { value: 'museum', label: 'Musei' },
  { value: 'attraction', label: 'Attrazioni' },
  { value: 'viewpoint', label: 'Punti panoramici' },
  { value: 'artwork', label: "Opere d'arte" },
  { value: 'gallery', label: 'Gallerie' },
  { value: 'theme_park', label: 'Parchi tematici' },
  { value: 'zoo', label: 'Zoo / faunistici' },
];

// Etichette italiane per i valori grezzi OSM (tourism/historic).
const KIND_LABELS: Record<string, string> = {
  information: 'Info',
  museum: 'Museo',
  attraction: 'Attrazione',
  viewpoint: 'Panorama',
  artwork: "Opera d'arte",
  gallery: 'Galleria',
  theme_park: 'Parco',
  zoo: 'Zoo',
  castle: 'Castello',
  ruins: 'Rovine',
  monument: 'Monumento',
  memorial: 'Memoriale',
  archaeological_site: 'Sito archeologico',
};

const SARDINIA_CENTER: L.LatLngTuple = [40.05, 9.05];

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

// Marker a goccia bianca bordata (evita gli asset Leaflet mancanti).
function pin(): L.DivIcon {
  const size = 30;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;display:grid;place-items:center;background:#fff;border:2px solid #0b6e75;box-shadow:0 1px 5px rgba(20,30,30,.35);font-size:15px;line-height:1;">📍</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
  });
}

@Component({
  selector: 'app-poi-page',
  imports: [FormsModule],
  templateUrl: './poi-page.html',
  styleUrl: './poi-page.css',
})
export class PoiPage implements AfterViewInit, OnDestroy {
  private readonly feeds = inject(FeedsService);

  protected readonly data = signal<PoiResponse | null>(null);
  protected readonly loading = signal(false);
  protected readonly searched = signal(false);
  protected readonly provinces = PROVINCES;
  protected readonly poiTypes = POI_TYPES;

  protected query = '';
  protected province: ProvinceCode | '' = '';
  protected tipo = '';
  private mode: 'search' | 'browse' | null = null;

  private readonly mapEl = viewChild.required<ElementRef<HTMLDivElement>>('mapEl');
  private map!: L.Map;
  private markers = L.layerGroup();
  private markerById = new Map<string, L.Marker>();

  ngAfterViewInit(): void {
    this.map = L.map(this.mapEl().nativeElement, { center: SARDINIA_CENTER, zoom: 8 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(this.map);
    this.markers.addTo(this.map);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  // Ricerca per nome su tutta la Sardegna.
  search(): void {
    const q = this.query.trim();
    if (q.length < 2) return;
    this.mode = 'search';
    this.run(this.feeds.searchPoi(q, this.tipo || undefined));
  }

  // Sfoglia i luoghi di una provincia.
  browse(): void {
    if (!this.province) return;
    this.mode = 'browse';
    this.run(this.feeds.poi(this.province, this.tipo || undefined));
  }

  // Il cambio tipo rilancia la modalità attiva.
  onTipoChange(): void {
    if (this.mode === 'search') this.search();
    else if (this.mode === 'browse') this.browse();
  }

  private run(req: ReturnType<FeedsService['poi']>): void {
    // La ricerca-isola è lenta (Overpass): evita richieste concorrenti duplicate.
    if (this.loading()) return;
    this.loading.set(true);
    this.data.set(null);
    req.subscribe({
      next: (d) => {
        this.data.set(d);
        this.renderMarkers(d.items);
      },
      complete: () => {
        this.loading.set(false);
        this.searched.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.searched.set(true);
      },
    });
  }

  private renderMarkers(items: Poi[]): void {
    this.markers.clearLayers();
    this.markerById.clear();
    const pts: L.LatLngExpression[] = [];
    for (const p of items) {
      const html = `<strong>${escapeHtml(p.name ?? '')}</strong>${
        p.kind ? `<br>${escapeHtml(this.kindLabel(p.kind))}` : ''
      }`;
      const m = L.marker([p.lat, p.lng], { icon: pin() }).bindPopup(html).addTo(this.markers);
      this.markerById.set(p.id, m);
      pts.push([p.lat, p.lng]);
    }
    if (pts.length) this.map.fitBounds(L.latLngBounds(pts), { padding: [30, 30], maxZoom: 15 });
    else this.map.setView(SARDINIA_CENTER, 8);
  }

  // Click su una card: centra la mappa sul luogo e apre il popup.
  focus(p: Poi): void {
    this.map.setView([p.lat, p.lng], 15);
    this.markerById.get(p.id)?.openPopup();
    this.mapEl().nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Anteprima statica: tile OSM che contiene il punto (nessuna chiave richiesta).
  tilePreview(p: Poi): string {
    const z = 14;
    const n = 2 ** z;
    const x = Math.floor(((p.lng + 180) / 360) * n);
    const latRad = (p.lat * Math.PI) / 180;
    const y = Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
    );
    return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  }

  kindLabel(kind: string | null): string {
    if (!kind) return '';
    return KIND_LABELS[kind] ?? kind;
  }
  osmLink(id: string): string {
    return `https://www.openstreetmap.org/${id}`;
  }
}
