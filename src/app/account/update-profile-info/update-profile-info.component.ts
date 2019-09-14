import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '@shared/services/auth.service';
import { UserService } from '@shared/services/user.service';
import { User } from '@shared/models/user';

@Component({
  selector: 'app-update-profile-info',
  templateUrl: './update-profile-info.component.html',
  styleUrls: ['./update-profile-info.component.scss'],
})
export class UpdateProfileInfoComponent implements OnInit {

  @Input() appUserInfo: User;
  @Output() appUserInfoChange = new EventEmitter<any>();

  updateInfoForm: FormGroup;
  savingInfo: boolean = false;
  onEdit: boolean = false;
  error: any;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private changeRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.updateInfoForm = this.formBuilder.group({
      name: [this.appUserInfo.name, Validators.required],
      email: [{value: this.appUserInfo.email, disabled: true}],
      contactNumber: [this.appUserInfo.contactNumber],
      address: [this.appUserInfo.address],
    });
  }

  async saveChanges() {
    try {
      this.savingInfo = true;
      this.changeRef.detectChanges();

      await this.auth.updateName(this.updateInfoForm.value.name);
      await this.userService.updateUser(
        this.auth.currentAuthUser.uid,
        this.updateInfoForm.value.name,
        this.updateInfoForm.value.contactNumber,
        this.updateInfoForm.value.address,
      );

      this.setProfileInfo(
        this.updateInfoForm.value.name,
        this.updateInfoForm.value.contactNumber,
        this.updateInfoForm.value.address,
      );

      this.appUserInfoChange.emit(this.appUserInfo);
      this.onEdit = false;
    } catch (error) {
      this.error = error;
    } finally {
      this.savingInfo = false;
      this.changeRef.detectChanges();
    }
  }

  cancel() {
    this.initForm();
    this.onEdit = false;
    this.error = null;
    this.changeRef.detectChanges();
  }

  enableEdit() {
    this.onEdit = true;
    this.changeRef.detectChanges();
  }

  setProfileInfo(
    name: string,
    contactNumber: string,
    address: string,
  ) {
    this.appUserInfo = {
      ...this.appUserInfo,
      name,
      contactNumber,
      address,
    }
  }
}
