// Tipi (parziali) delle risposte aggregate del backend. Modellati solo i campi
// effettivamente usati dal frontend; il resto resta accessibile come unknown.

import { ProvinceCode } from './province.models';

export interface WeatherCurrent {
  temperature_2m?: number;
  apparent_temperature?: number;
  relative_humidity_2m?: number;
  weather_code?: number;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
  precipitation?: number;
  is_day?: number;
}

export interface WeatherDaily {
  time?: string[];
  weather_code?: number[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  precipitation_sum?: number[];
  wind_speed_10m_max?: number[];
}

export interface WeatherProvince {
  province: { code: ProvinceCode; name: string };
  coordinates: { lat: number; lng: number };
  current: WeatherCurrent | null;
  units?: unknown;
  daily?: WeatherDaily | null;
}

export interface Fire {
  id: string | number | null;
  lat: number | null;
  lng: number | null;
  acquired_at: string | null;
  confidence: string | number | null;
  source: string;
}
export interface FiresResponse {
  available: boolean;
  count: number;
  fires: Fire[];
  error?: string;
}

export interface Alert {
  title: string | null;
  summary: string | null;
  link: string | null;
  published_at: string | null;
  source: string;
}
export interface FloodsResponse {
  available: boolean;
  count: number;
  alerts: Alert[];
  note?: string;
  error?: string;
}

export interface NewsItem {
  source: string;
  title: string | null;
  link: string | null;
  summary: string | null;
  published_at: string | null;
}
export interface NewsResponse {
  sources: string[];
  count: number;
  total: number;
  items: NewsItem[];
}

export interface Flight {
  icao24: string;
  callsign: string | null;
  origin_country: string | null;
  lat: number | null;
  lng: number | null;
  geo_altitude: number | null;
  velocity: number | null;
  true_track: number | null;
}
export interface FlightsResponse {
  available: boolean;
  count: number;
  updated_at?: string | null;
  flights: Flight[];
  error?: string;
}

export interface Vessel {
  mmsi: number;
  name: string | null;
  lat: number | null;
  lng: number | null;
  sog: number | null;
  cog: number | null;
  heading: number | null;
  updated_at: string;
}
export interface VesselsResponse {
  available: boolean;
  count: number;
  vessels: Vessel[];
  note?: string;
}

export interface TrafficIncident {
  id: string | null;
  category: string;
  description: string | null;
  from: string | null;
  to: string | null;
  road_numbers: string[] | null;
  geometry: unknown;
}
export interface TrafficResponse {
  available: boolean;
  count: number;
  incidents: TrafficIncident[];
  note?: string;
  error?: string;
}
