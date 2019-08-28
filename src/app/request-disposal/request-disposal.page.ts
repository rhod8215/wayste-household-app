import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapSearchLocationComponent } from './map-search-location/map-search-location.component';
import { UserService } from '@shared/services/user.service';
import { DisposalService } from '@shared/services/disposal.service';
import { User } from '@shared/models/user';
import { Location } from '@shared/models/location';

interface TrashType {
  name: string,
  isChecked: boolean,
  disabled?: boolean,
}

@Component({
  selector: 'app-request-disposal',
  templateUrl: './request-disposal.page.html',
  styleUrls: ['./request-disposal.page.scss'],
})
export class RequestDisposalPage implements OnInit {
  pickUpLocation: Location;
  trashTypeList: Array<TrashType>;
  trashPhotoList: Array<any>;
  IMAGE_LIST_MAX_LENGTH = 3;

  constructor(
    private modalCtrl: ModalController,
    private disposalService: DisposalService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.trashTypeList = [
      {
        name: 'Plastic Bottles',
        isChecked: true,
        disabled: true,
      }
    ];

    this.trashPhotoList = [];
  }

  async openMapSearchLocationModal() {
    const modal = await this.modalCtrl.create({
      component: MapSearchLocationComponent
    });

    modal.onDidDismiss()
      .then(data => {
        if (data.data) {
          this.pickUpLocation = data.data;
        }
      });

    return await modal.present();
  }

  canStillAddImage() {
    return this.trashPhotoList.length < this.IMAGE_LIST_MAX_LENGTH;
  }

  async requestDisposal() {
    const household: User = this.userService.currentUser;
    const householdLoc: Location = this.pickUpLocation;

    this.disposalService.requestDisposal(
      household,
      householdLoc
    );
  }

  get canRequestDisposal(): boolean {
    return this.pickUpLocation && !!this.trashPhotoList.length;
  }
}
