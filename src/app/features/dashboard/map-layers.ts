// Metadati dei layer mappa (selettore fuori dalla mappa) + utility meteo.
// Solo layer con coordinate vivono sulla mappa.

export type GeoLayer = 'weather' | 'fires' | 'flights' | 'vessels' | 'traffic' | 'events';

export interface LayerDef {
  id: GeoLayer;
  label: string;
  color: string;
  icon: string; // emoji per chip + marker
}

export const LAYERS: LayerDef[] = [
  { id: 'weather', label: 'Meteo', color: '#2a7fb8', icon: '🌤️' },
  { id: 'fires', label: 'Incendi', color: '#d1452b', icon: '🔥' },
  { id: 'flights', label: 'Voli', color: '#5a4fa3', icon: '✈️' },
  { id: 'vessels', label: 'Navi', color: '#0b8a86', icon: '⛴️' },
  { id: 'traffic', label: 'Traffico', color: '#c98a16', icon: '🚧' },
  { id: 'events', label: 'Eventi', color: '#2e7d5b', icon: '🎭' },
];

export interface WeatherInfo {
  label: string;
  icon: string;
}

// Codici meteo WMO (Open-Meteo) → descrizione it + icona. isDay distingue
// sereno giorno/notte.
export function weatherInfo(code: number | null | undefined, isDay = 1): WeatherInfo {
  const day = isDay !== 0;
  switch (code) {
    case 0:
      return { label: 'Sereno', icon: day ? '☀️' : '🌙' };
    case 1:
      return { label: 'Prev. sereno', icon: day ? '🌤️' : '🌙' };
    case 2:
      return { label: 'Parz. nuvoloso', icon: '⛅' };
    case 3:
      return { label: 'Coperto', icon: '☁️' };
    case 45:
    case 48:
      return { label: 'Nebbia', icon: '🌫️' };
    case 51:
    case 53:
    case 55:
      return { label: 'Pioviggine', icon: '🌦️' };
    case 56:
    case 57:
      return { label: 'Pioviggine gelata', icon: '🌧️' };
    case 61:
    case 63:
    case 65:
      return { label: 'Pioggia', icon: '🌧️' };
    case 66:
    case 67:
      return { label: 'Pioggia gelata', icon: '🌧️' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { label: 'Neve', icon: '🌨️' };
    case 80:
    case 81:
    case 82:
      return { label: 'Rovesci', icon: '🌦️' };
    case 85:
    case 86:
      return { label: 'Rovesci di neve', icon: '🌨️' };
    case 95:
      return { label: 'Temporale', icon: '⛈️' };
    case 96:
    case 99:
      return { label: 'Temporale con grandine', icon: '⛈️' };
    default:
      return { label: 'n/d', icon: '🌡️' };
  }
}

// Direzione vento in gradi → punto cardinale.
export function windDir(deg: number | null | undefined): string {
  if (deg == null) return '';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}
