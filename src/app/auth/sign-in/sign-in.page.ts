import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  signInForm: FormGroup;
  processing: boolean;

  constructor(
    private alertCtrl: AlertController,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.processing = false;
    this.signInForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  async emailPassSignIn() {
    this.processing = true;
    this.markFormGroupTouched(this.signInForm);
    if (this.signInForm.invalid) {
      this.processing = false;
      return;
    }

    const toast = await this.toastCtrl.create({
      message: 'Signing in...'
    });
    toast.present();

    const { email, password } = this.signInForm.value;
    this.auth.signInViaEmail(email, password)
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

  async fbSignIn() {
    const toast = await this.toastCtrl.create({
      message: 'Redirecting you to Facebook...'
    });
    toast.present();

    this.auth.authViaFB()
      .then(() => {
        this.router.navigateByUrl('home');
      })
      .catch(error => {
        this._presentAlertPromptOnError(error);
      })
      .finally(() => toast.dismiss());
  }

  async googleSignIn() {
    const toast = await this.toastCtrl.create({
      message: 'Redirecting you to Google...'
    });
    toast.present();

    this.auth.authViaGoogle()
      .then(() => {
        this.router.navigateByUrl('home');
      })
      .catch(error => {
        this._presentAlertPromptOnError(error);
      })
      .finally(() => toast.dismiss());
  }

  goToSignUp() {
    this.signInForm.reset();
    this.router.navigate(['auth/sign-up']);
  }

  async _presentAlertPromptOnError(error: { code: string, message: string }) {
    let alertErrorMessage = '';
    switch (error.code) {
      // SIGN IN ERRORS
      case 'auth/invalid-email':
        alertErrorMessage = error.message;
        break;
      case 'auth/user-disabled':
        alertErrorMessage = error.message;
        break;
      case 'auth/user-not-found':
        alertErrorMessage = 'User not registered!';
        break;
      case 'auth/wrong-password':
        alertErrorMessage = error.message;
        break;

      // SIGN IN WITH REDIRECT (FB and GOOGLE)
      case 'auth/auth-domain-config-required':
        alertErrorMessage = error.message;
        break;
      case 'auth/operation-not-supported-in-this-environment':
        alertErrorMessage = error.message;
        break;
      case 'auth/unauthorized-domain':
        alertErrorMessage = error.message;
        break;

      // DEFAULT
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
  get f() { return this.signInForm.controls; }
}
