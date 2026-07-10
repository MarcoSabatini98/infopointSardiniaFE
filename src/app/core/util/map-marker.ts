import * as L from 'leaflet';

// Escape per testo interpolato negli HTML dei popup Leaflet (creati fuori
// dall'incapsulamento del componente, quindi niente binding Angular).
export function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

// Marker a icona: cerchio bianco bordato col colore dato + emoji. Stili inline
// perché Leaflet crea il DOM fuori dall'incapsulamento del componente.
export function pin(emoji = '📍', color = '#0b6e75'): L.DivIcon {
  const size = 32;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;display:grid;place-items:center;background:#fff;border:2px solid ${color};box-shadow:0 1px 5px rgba(20,30,30,.35);font-size:16px;line-height:1;">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
  });
}
