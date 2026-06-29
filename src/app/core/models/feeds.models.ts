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
  wind_gusts_10m?: number;
  precipitation?: number;
  pressure_msl?: number;
  cloud_cover?: number;
  is_day?: number;
}

export interface WeatherDaily {
  time?: string[];
  weather_code?: number[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  apparent_temperature_max?: number[];
  precipitation_sum?: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max?: number[];
  wind_gusts_10m_max?: number[];
  uv_index_max?: number[];
  sunrise?: string[];
  sunset?: string[];
}

export interface WeatherHourly {
  time?: string[];
  temperature_2m?: number[];
  apparent_temperature?: number[];
  relative_humidity_2m?: number[];
  precipitation_probability?: number[];
  precipitation?: number[];
  weather_code?: number[];
  wind_speed_10m?: number[];
  wind_direction_10m?: number[];
}

export interface WeatherAdvisory {
  type: string;
  level: 'warn' | 'danger';
  label: string;
  day: string;
}

export interface WeatherProvince {
  province?: { code: ProvinceCode; name: string };
  location?: { name: string; lat: number; lng: number; province_code: ProvinceCode | null };
  coordinates: { lat: number; lng: number };
  current: WeatherCurrent | null;
  units?: unknown;
  daily?: WeatherDaily | null;
  hourly?: WeatherHourly | null;
  advisories?: WeatherAdvisory[];
  query?: string;
  province_name?: string | null;
}

export type FireSeverity = 'bassa' | 'media' | 'alta' | 'estrema' | 'n/d';

export interface Fire {
  id: string | number | null;
  lat: number | null;
  lng: number | null;
  acquired_at: string | null;
  confidence: string | number | null;
  brightness?: number | null;
  frp?: number | null;
  satellite?: string | null;
  daynight?: string | null;
  province_code?: ProvinceCode | null;
  severity?: FireSeverity;
  source: string;
}
export interface FiresStats {
  by_province: Record<string, number>;
  by_severity: Record<string, number>;
  max_frp: number | null;
}
export interface FiresResponse {
  available: boolean;
  source?: string;
  count: number;
  updated_at?: string | null;
  stats?: FiresStats;
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

export type FlightPhase =
  | 'in arrivo'
  | 'in partenza'
  | 'in avvicinamento'
  | 'in transito'
  | 'a terra';

export interface Flight {
  icao24: string;
  callsign: string | null;
  flight?: string | null;
  airline?: string | null;
  origin_country: string | null;
  lat: number | null;
  lng: number | null;
  baro_altitude?: number | null;
  geo_altitude: number | null;
  velocity: number | null;
  true_track: number | null;
  vertical_rate?: number | null;
  phase?: FlightPhase;
  airport?: string | null;
  on_ground?: boolean | null;
}
export interface FlightsResponse {
  available: boolean;
  count: number;
  updated_at?: string | null;
  stats?: { by_airline: Record<string, number>; by_phase: Record<string, number> };
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
  type?: number | null;
  type_label?: string | null;
  destination?: string | null;
  callsign?: string | null;
  updated_at: string;
}
export interface VesselsResponse {
  available: boolean;
  count: number;
  stats?: { by_type: Record<string, number> };
  vessels: Vessel[];
  note?: string;
}

export type TrafficSeverity = 'chiusura' | 'grave' | 'moderata' | 'lieve' | 'n/d';

export interface TrafficIncident {
  id: string | null;
  category: string;
  severity: TrafficSeverity;
  magnitude_of_delay?: number | null;
  description: string | null;
  from: string | null;
  to: string | null;
  road_numbers: string[] | null;
  length_m?: number | null;
  delay_s?: number | null;
  comune?: string | null;
  province_code?: ProvinceCode | null;
  lat?: number | null;
  lng?: number | null;
  geometry?: unknown;
}
// ── Mare (Open-Meteo Marine) ──
export interface MarineCurrent {
  wave_height?: number;
  wave_direction?: number;
  wave_period?: number;
  sea_surface_temperature?: number;
}
export interface MarineProvince {
  province: { code: ProvinceCode; name: string };
  coordinates: { lat: number; lng: number };
  current: MarineCurrent | null;
  daily?: {
    time?: string[];
    wave_height_max?: number[];
    wave_period_max?: number[];
    wave_direction_dominant?: number[];
  } | null;
}

// ── Qualità aria (Open-Meteo Air Quality) ──
export interface AirCurrent {
  european_aqi?: number;
  pm10?: number;
  pm2_5?: number;
  ozone?: number;
  nitrogen_dioxide?: number;
  sulphur_dioxide?: number;
  carbon_monoxide?: number;
  uv_index?: number;
  alder_pollen?: number;
  birch_pollen?: number;
  grass_pollen?: number;
  olive_pollen?: number;
  ragweed_pollen?: number;
}
export interface AirResponse {
  coordinates: { lat: number; lng: number };
  current: AirCurrent | null;
  aqi_label: string | null;
}

// ── Carburanti (MIMIT) ──
export interface FuelPrice {
  type: string;
  price: number;
  self: boolean;
}
export interface FuelStation {
  id: string;
  brand: string | null;
  name: string | null;
  address: string | null;
  comune: string | null;
  province_code: ProvinceCode;
  lat: number | null;
  lng: number | null;
  fuels: FuelPrice[];
}
export interface FuelResponse {
  available: boolean;
  count: number;
  updated_at?: string | null;
  stats?: { by_province: Record<string, number> };
  stations: FuelStation[];
  error?: string;
}

export interface TrafficResponse {
  available: boolean;
  count: number;
  stats?: { by_province: Record<string, number>; by_severity: Record<string, number> };
  incidents: TrafficIncident[];
  note?: string;
  error?: string;
}
