import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Coords, RTDBLoc } from '@shared/models/location';
import { GeoFire }from 'geofire';
import { BehaviorSubject } from 'rxjs';

declare var google: any;

const COLLECTOR_CURRENT_LOCATION_LIST = '/collectorCurrentLocationList';
const REQUESTED_DISPOSAL_LOCATION_LIST = '/requestedDisposalLocationList';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  geoFireReqDisposalLocRef: any;
  geoFireCollectorCurrLocRef: any;
  isCollectorNearby$ = new BehaviorSubject(false);

  constructor(
    private geolocation: Geolocation,
    private rtdb: AngularFireDatabase,
  ) {
    const reqDisposalLocRef = this.rtdb.list(REQUESTED_DISPOSAL_LOCATION_LIST);
    this.geoFireReqDisposalLocRef = new GeoFire(reqDisposalLocRef.query.ref);

    const collectorCurrLocRef = this.rtdb.list(COLLECTOR_CURRENT_LOCATION_LIST);
    this.geoFireCollectorCurrLocRef = new GeoFire(collectorCurrLocRef.query.ref);
  }

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

  async addDisposalLocation(disposalId: string, currentCoords: Coords) {
    const coordsArray = [currentCoords.lat, currentCoords.lng];
    this.geoFireReqDisposalLocRef.set(disposalId, coordsArray)
      .then(_ => console.log('location saved'))
      .catch(err => console.log(err));
  }

  getCollectorLocationWithinRadius(
    collectorId: string,
    currentCoords: Coords,
    radius: number = 0.01 // km
  ): void {
    this.geoFireCollectorCurrLocRef.query({
      center: [currentCoords.lat, currentCoords.lng],
      radius
    })
    .on('key_entered', (key, location, distance) => {
      if (key === collectorId) {
        this.isCollectorNearby$.next(true);
      }
    });
  }
}
