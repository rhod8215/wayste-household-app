export interface Coords {
  lat: number;
  lng: number;
}

export interface Location {
  placeId: string;
  name: string;
  address: string;
  coords: Coords;
}

export interface text_search_loc {
  address:string;
}