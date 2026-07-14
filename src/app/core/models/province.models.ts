export type ProvinceCode = 'CA' | 'SS' | 'NU' | 'OR' | 'SU';

export interface Province {
  code: ProvinceCode;
  name: string;
  capoluogo: string;
  lat: number;
  lng: number;
}

// Le 5 province (per selettori/filtri lato FE).
export const PROVINCES: { code: ProvinceCode; name: string; capoluogo: string }[] = [
  { code: 'CA', name: 'Cagliari', capoluogo: 'Cagliari' },
  { code: 'SS', name: 'Sassari', capoluogo: 'Sassari' },
  { code: 'NU', name: 'Nuoro', capoluogo: 'Nuoro' },
  { code: 'OR', name: 'Oristano', capoluogo: 'Oristano' },
  { code: 'SU', name: 'Sud Sardegna', capoluogo: 'Carbonia' },
];

// Layer selezionabili sulla mappa (allineati al backend /map/layers/:layer).
export type MapLayer =
  | 'weather'
  | 'fires'
  | 'floods'
  | 'news'
  | 'events'
  | 'flights'
  | 'vessels'
  | 'traffic';
