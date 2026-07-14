import { ProvinceCode } from './province.models';

export type EventType = 'NATURALE' | 'CULTURALE';
export type EventStatus = 'bozza' | 'pubblicato' | 'annullato';

export interface EventItem {
  uuid: string;
  type: EventType;
  category: string;
  title: string;
  description: string | null;
  province_code: ProvinceCode;
  comune: string | null;
  lat: number | null;
  lng: number | null;
  start_date: string;
  end_date: string | null;
  time: string | null;
  venue: string | null;
  icon_url: string | null;
  logo_url: string | null;
  is_free: boolean;
  price: number | null;
  website: string | null;
  contacts: string | null;
  organizer: string | null;
  status: EventStatus;
  creator?: { uuid: string; name: string } | null;
}

// Evento mappabile unificato (DB + esterni geocodati) servito dal BE per la
// mappa e per l'aggregazione provinciale.
export interface MapEvent {
  title: string;
  lat: number;
  lng: number;
  province_code: ProvinceCode;
  comune: string | null;
  date: string | null;
  category: string;
  status: string;
  source: string;
  link?: string | null;
  uuid?: string;
}

// Evento dalla fonte esterna ufficiale (SardegnaTurismo).
export interface ExternalEvent {
  title: string;
  link: string | null;
  date: string | null;
  location: string | null;
  image: string | null;
  source: string;
}

// Filtri per la lista eventi (query string).
export interface EventFilters {
  type?: EventType;
  category?: string;
  province_code?: ProvinceCode;
  status?: EventStatus;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  limit?: number;
}

// Categorie per tipo (allineate al backend event.constants).
export const CATEGORIES_BY_TYPE: Record<EventType, string[]> = {
  NATURALE: [
    'incendio',
    'allagamento',
    'allerta_meteo',
    'frana',
    'ondata_calore',
    'vento_forte',
    'mareggiata',
    'altro',
  ],
  CULTURALE: ['sagra', 'concerto', 'mostra', 'fiera', 'sportivo', 'religioso', 'teatro', 'altro'],
};
