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
