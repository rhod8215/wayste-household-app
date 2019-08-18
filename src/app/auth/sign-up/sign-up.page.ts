import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  public signUpForm: FormGroup;
  public processing: boolean;

  constructor(
    private alertCtrl: AlertController,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.processing = false;
    this.signUpForm = this.formBuilder.group({
      fullName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      // contactNumber: [null, Validators.required], // TO DO
      password: [null, Validators.required],
    });
  }

  async emailPassSignUp() {
    this.processing = true;
    this.markFormGroupTouched(this.signUpForm);

    if (this.signUpForm.invalid) {
      this.processing = false;
      return;
    }

    const toast = await this.toastCtrl.create({
      message: 'Signing you up...'
    });
    toast.present();

    const {
      fullName,
      email,
      contactNumber,
      password
    } = this.signUpForm.value;

    this.auth.signUpViaEmail(
      fullName,
      email,
      // contactNumber, // TO DO
      password
    )
    .then(() => {
      this.router.navigateByUrl('home');
    })
    .catch(error => {
      this._presentAlertPromptOnError(error);
    })
    .finally(() => {
      toast.dismiss();
      this.processing = false;
    });
  }

  goToSignIn() {
    this.signUpForm.reset();
    this.router.navigate(['auth/sign-in']);
  }

  async _presentAlertPromptOnError(error: {code: string, message: string}) {
    let alertErrorMessage = '';
    switch (error.code) {
      case 'auth/email-already-in-use':
        alertErrorMessage = 'Email already in use! Sign in instead.';
        break;
      case 'auth/invalid-email':
        alertErrorMessage = 'Invalid email format';
        break;
      case 'auth/operation-not-allowed':
        alertErrorMessage = 'Sign up via email and password not allowed. Contact admin for support.';
        break;
      default:
        alertErrorMessage = error.message;
        break;
    }

    const errorAlert = await this.alertCtrl.create({
      header: 'Error',
      message: alertErrorMessage,
      buttons: ['Okay'],
    });

    await errorAlert.present();
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // convenience getter for easy access to form fields and errors
  get f() { return this.signUpForm.controls; }
}
