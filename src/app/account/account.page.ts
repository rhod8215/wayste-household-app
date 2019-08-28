import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { AuthService } from '@shared/services/auth.service';
import { UserService } from '@shared/services/user.service';

import { UpdateProfileInfoComponent } from './update-profile-info/update-profile-info.component';
import { PhotoCropperComponent } from './photo-cropper/photo-cropper.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {

  appUserInfo: any; // TO DO: AppUser model
  isAccountLoaded: any;
  subscription: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private userService: UserService,
    private changeRef: ChangeDetectorRef,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.isAccountLoaded = false;
    this.subscription = this.userService.currentUser$.subscribe(user => {
      if (!!user) {
        this.appUserInfo = {
          userId: this.auth.currentAuthUser.uid,
          fullName: this.auth.currentAuthUser.displayName ?
            this.auth.currentAuthUser.displayName : '(Please update profile info)',
          email: this.userService.currentUser.email ?
            this.userService.currentUser.email : '',
          contactNumber: this.userService.currentUser.contactNumber ?
            this.userService.currentUser.contactNumber : '',
          address: this.userService.currentUser.address ?
            this.userService.currentUser.address : '',
          photoUrl: this.auth.currentAuthUser.photoURL ?
            this.auth.currentAuthUser.photoURL : 'assets/img/dp_paui.png',
        };
        this.isAccountLoaded = true;
        this.changeRef.detectChanges();
      }
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [ file ] = event.target.files;
      reader.onload = () => {
        this.openPhotoCropper(reader.result, file.type);
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * @param fileDataUrl Base64url formatted string
   */
  async openPhotoCropper(fileDataUrl: string|ArrayBuffer, fileType: string) {
    const modal = await this.modalCtrl.create({
      component: PhotoCropperComponent,
      componentProps: {
        imageDataUrl: fileDataUrl,
        fileType
      },
    });

    modal.onDidDismiss()
      .then((returnedData) => {
        if (returnedData.data) {
          this.appUserInfo = {
            ...this.appUserInfo,
            photoUrl: returnedData.data
          };
        }
      });
    return await modal.present();
  }

  async onCordovaUpload() {
    // const cameraOptions: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    // };

    // const actionSheet = await this.actionSheetCtrl.create({
    //   buttons: [
    //     {
    //       text: 'Camera',
    //       icon: 'camera',
    //       handler: () => {
    //         cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA;
    //       }
    //     }, {
    //       text: 'Photo Album',
    //       icon: 'photos',
    //       handler: () => {
    //         cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    //       }
    //     }
    //   ]
    // });

    // await actionSheet.present();
    // await actionSheet.onDidDismiss();

    // if (typeof cameraOptions.sourceType !== undefined) {
    //   const imageURI = await this.camera.getPicture(cameraOptions);
    //   this.imageFileArray.push(
    //     this.formBuilder.control(`data:image/jpeg;base64,${imageURI}`)
    //   );
    // }
  }

  /**
   * @param imageFileInput Actually an `ElementRef` that extends
   * `nativeElement`. `ElementRef` doesn't have a `click` method,
   * thereby causing a compilation error. Replaced with `any` due
   * to avoid this compilation error.
   */
  openFileDialog(imageFileInput: any) {
    if (this.platform.is('cordova')) {
      this.onCordovaUpload()
        .catch(error => alert(error));
    } else {
      imageFileInput.click();
    }
  }

  async openEditAccountModal() {
    const modal = await this.modalCtrl.create({
      component: UpdateProfileInfoComponent,
      componentProps: {
        fullName: this.appUserInfo.fullName,
        email: this.appUserInfo.email,
        contactNumber: this.appUserInfo.contactNumber,
        address: this.appUserInfo.address,
      },
    });

    modal.onDidDismiss()
      .then((returnedData) => {
        if (returnedData.data) {
          this.appUserInfo = {
            fullName: returnedData.data.fullName,
            email: returnedData.data.email,
            contactNumber: returnedData.data.contactNumber,
            address: returnedData.data.address
          };
        }
      });
    return await modal.present();
  }
}
