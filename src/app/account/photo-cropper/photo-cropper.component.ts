import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CropperComponent } from 'angular-cropperjs';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-photo-cropper',
  templateUrl: './photo-cropper.component.html',
  styleUrls: ['./photo-cropper.component.scss'],
})
export class PhotoCropperComponent implements OnInit {
  @Input() imageDataUrl: string;
  @Input() fileType: string;
  @ViewChild('photoCropper', { static: false }) public photoCropper: CropperComponent;

  config: any;
  uploading: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.config = {
      viewMode: 2,
      dragMode: 'move',
      aspectRatio: 1,
      center: true,
      highlight: false,
      guide: false,
      restore: false,
      movable: true,
      background: true,
      minCropBoxWidth: 200,
      minCropBoxHeight: 200,
    };
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async confirm() {
    this.uploading = true;
    const croppedImageDataUrl = await this.photoCropper
      .cropper.getCroppedCanvas({
        width: 200,
        height: 200,
      }).toDataURL(this.fileType);

    const newPhotoUrl = await this.authService.uploadAuthPhoto(croppedImageDataUrl);
    this.uploading = false;
    this.modalCtrl.dismiss(newPhotoUrl);
  }
}
