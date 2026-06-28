export type ProvinceCode = 'CA' | 'SS' | 'NU' | 'OR' | 'SU';

export interface Province {
  code: ProvinceCode;
  name: string;
  capoluogo: string;
  lat: number;
  lng: number;
}

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
