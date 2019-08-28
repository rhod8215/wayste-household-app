import { Component, AfterContentInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapsAPILoader } from '@agm/core';
import { LocationService } from '@shared/services/location.service';
import { Location } from '@shared/models/location';

@Component({
  selector: 'app-map-search-location',
  templateUrl: './map-search-location.component.html',
  styleUrls: ['./map-search-location.component.scss'],
})
export class MapSearchLocationComponent implements AfterContentInit {

  canLoadMap: boolean;
  mapRef: any;
  placeName: string = '';
  pinnedLocationDetails: any;

  householdPin = {
    url: 'assets/pins/household.png',
    scaledSize: {
      width: 30,
      height: 40
    }
  };

  constructor(
    private modalCtrl: ModalController,
    private mapsApiLoader: MapsAPILoader,
    public locationService: LocationService
  ) { }

  ngAfterContentInit() {
    this.initLocation();
  }

  async initLocation() {
    await this.mapsApiLoader.load();
    const { lat, lng } = await this.locationService.getCurrentLocation();
    await this.selectLocation(lat, lng);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    this.modalCtrl.dismiss(this.pinnedLocationDetails);
  }

  mapReady($event: any) {
    this.mapRef = $event;
  }

  async markerUpdated(event) {
    const { coords: { lat, lng } } = event;
    this.selectLocation(lat, lng);
  }

  async selectLocation(lat, lng) {
    const locationDetails: any = await this.locationService.reverseGeocode(lat, lng);
    const locationName: any = await this.locationService.getNameFromPlaceId(this.mapRef, locationDetails.place_id);
    const selectedLocation: Location = {
      placeId: locationDetails.place_id,
      name: locationName,
      address: locationDetails.formatted_address,
      coords: { lat, lng }
    }

    this.pinnedLocationDetails = Object.assign({}, selectedLocation);
  }
}
