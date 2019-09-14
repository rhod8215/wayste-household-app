import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';

import { UserService } from '@shared/services/user.service';
import { DisposalService } from '@shared/services/disposal.service';
import { User } from '@shared/models/user';
import { Location,text_search_loc } from '@shared/models/location';
import {TextSearchLocationComponent} from './text-search-location/text-search-location.component';

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
  searchedLoc:text_search_loc;

  processing: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
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
      component: TextSearchLocationComponent
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
    let processingToast;

    try {
      this.processing = true;

      processingToast = await this.toastCtrl.create({
        message: 'Processing disposal request...'
      });
      processingToast.present();

      const disposalId = await this.disposalService.createDisposal(
        household,
        householdLoc
      );

      const photoUrlList = await this.disposalService.saveDisposalImages(disposalId, this.trashPhotoList);
      await this.disposalService.updateDisposalWithPhotoUrls(disposalId, photoUrlList);
    } catch (error) {
      const errorAlert = await this.alertCtrl.create({
        header: 'Error',
        message: error.message || 'Unable to process request. Please try again later.',
        buttons: ['Okay'],
      });
      await errorAlert.present();
    } finally {
      this.processing = false;
      processingToast.dismiss();
    }
  }

  async _presentAlerPromptOnError(
    error: { code?: string, message: string },
    callback?
  ) {
    const errorAlert = await this.alertCtrl.create({
      header: 'Alert',
      message: error.message,
      buttons: ['Okay'],
    });
    await errorAlert.present();
    if (callback) {
      errorAlert.onDidDismiss()
        .finally(callback);
    }
  }

  get canRequestDisposal(): boolean {
    return this.pickUpLocation && !!this.trashPhotoList.length;
  }
}
