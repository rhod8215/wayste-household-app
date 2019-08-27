import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { AuthService } from '@shared/services/auth.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-update-profile-info',
  templateUrl: './update-profile-info.component.html',
  styleUrls: ['./update-profile-info.component.scss'],
})
export class UpdateProfileInfoComponent implements OnInit {

  @Input() fullName: string;
  @Input() email: string;
  @Input() contactNumber: string;
  @Input() address: string;

  updateInfoForm: FormGroup;
  error;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.updateInfoForm = this.formBuilder.group({
      fullName: [this.fullName, Validators.required],
      email: [{value: this.email, disabled: true}],
      contactNumber: [this.contactNumber],
      address: [this.address],
    });
  }

  async saveChanges() {
    try {
      await this.auth.updateName(this.updateInfoForm.value.fullName);
      await this.userService.updateUser(
        this.auth.currentAuthUser.uid,
        this.updateInfoForm.value.fullName,
        this.updateInfoForm.value.contactNumber,
        this.updateInfoForm.value.address,
      );

      this.modalCtrl.dismiss({
        fullName: this.updateInfoForm.value.fullName,
        email: this.updateInfoForm.value.email,
        contactNumber: this.updateInfoForm.value.contactNumber
      });
    } catch (error) {
      this.error = error;
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
