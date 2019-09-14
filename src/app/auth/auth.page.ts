import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {

  isUserLoaded: boolean;
  subscription: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isUserLoaded = false;
    this.subscription = this.auth.$currentAuthUser.subscribe(user => {
        if (user !== undefined && user !== null) {
          this.router.navigate(['home']);
        } else if (user === null) {
          this.router.navigate(['auth/sign-in']);
        }
        this.isUserLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
