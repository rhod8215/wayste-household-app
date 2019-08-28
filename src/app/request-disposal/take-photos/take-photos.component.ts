import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-take-photos',
  templateUrl: './take-photos.component.html',
  styleUrls: ['./take-photos.component.scss'],
})
export class TakePhotosComponent implements OnInit {
  @Input() trashPhotoList: Array<any>;
  @Output() trashPhotoListChange = new EventEmitter<any>();

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private platform: Platform
  ) { }

  ngOnInit() {}

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

  async onCordovaUpload() {
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA;
          }
        }, {
          text: 'Photo Album',
          icon: 'photos',
          handler: () => {
            cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
          }
        }
      ]
    });

    await actionSheet.present();
    await actionSheet.onDidDismiss();

    if (typeof cameraOptions.sourceType !== undefined) {
      const imageURI = await this.camera.getPicture(cameraOptions);
      this.trashPhotoList.push(
        `data:image/jpeg;base64,${imageURI}`
      );
      this.trashPhotoListChange.emit([...this.trashPhotoList])
    }
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.onload = () => {
        this.trashPhotoList.push(
          reader.result
        );
        this.trashPhotoListChange.emit([...this.trashPhotoList])
      };
      reader.readAsDataURL(file);
    }
  }

}
