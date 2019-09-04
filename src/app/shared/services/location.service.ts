import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Coords } from '@shared/models/location';


declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(
    private geolocation: Geolocation,
  ) { }

  async getCurrentLocation(): Promise<Coords> {
    const { coords } = await this.geolocation
      .getCurrentPosition({ enableHighAccuracy: true });
    return {
      lat: coords.latitude,
      lng: coords.longitude
    };
  }

  async getNameFromPlaceId(mapRef: any, placeId: string) {
    const placesService = new google.maps.places.PlacesService(mapRef);
    return new Promise((resolve, reject) => {
      placesService.getDetails({ placeId }, (result, status) => {
        if (status === 'OK') {
          if (result && result.name) {
            resolve(result.name);
          } else {
            reject('No details found');
          }
        } else {
          reject('No details found');
        }
      });
    });
  }

  async reverseGeocode(latitude: number, longitude: number) {
    const geocoder = new google.maps.Geocoder;
    const location: Coords = {
      lat: latitude,
      lng: longitude
    };

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            resolve(results[0]);
          } else {
            reject('No results to display');
          }
        } else {
          reject('No results to display');
        }
      })
    });
  }
}
