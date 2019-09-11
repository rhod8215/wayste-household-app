import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Subscription } from 'rxjs';

import { Collector } from '@shared/models/user';
import { Coords } from '@shared/models/location';
import { DisposalService } from '@shared/services/disposal.service';
import { UserService } from '@shared/services/user.service';
import { Disposal } from '@shared/models/disposal';

import { ChatComponent } from './chat/chat.component';
import { LocationService } from '@shared/services/location.service';
import { DirectionService } from '@shared/services/direction.service';

@Component({
  selector: 'app-track-collector',
  templateUrl: './track-collector.page.html',
  styleUrls: ['./track-collector.page.scss'],
})
export class TrackCollectorPage implements OnInit, OnDestroy {
  mapRef: any;
  directionDisplay: any;

  ongoingDisposal: Disposal;
  acceptDetails: any;
  loadingData: boolean = true;

  userSub: Subscription;
  disposalSub: Subscription;
  locSub: Subscription;

  note: string;

  householdPin = {
    url: 'assets/pins/household.png',
    scaledSize: {
      width: 30,
      height: 40
    }
  };

  collectorPin = {
    url: 'assets/pins/collector.png',
    scaledSize: {
      width: 35,
      height: 35
    }
  };

  constructor(
    private modalCtrl: ModalController,
    private callNumber: CallNumber,
    private disposalService: DisposalService,
    private userService: UserService,
    private locationService: LocationService,
    private directionService: DirectionService,
    private router: Router,
    private changeRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.note = 'Your eco-aide will be arriving soon.';

    this.userSub = this.userService.currentUser$.subscribe(async user => {
      if (!user) {
        return;
      }

      const householdId = user.id;
      const pendingAcceptDetails = await this.disposalService.getPendingAcceptanceDetails(householdId);
      const acceptedDetails = await this.disposalService.getAcceptanceDetails(householdId);

      if (!pendingAcceptDetails && !acceptedDetails) {
        this.router.navigate(['']);
        return;
      }

      this.acceptDetails = pendingAcceptDetails ? pendingAcceptDetails : acceptedDetails;
      this.loadingData = false;

      this.disposalSub = this.disposalService.getPendingDisposal(householdId)
        .subscribe(async snapValue => {
          if (!snapValue) {
            return;
          }

          let disposal = this.disposalService.getDisposalFromSnap(snapValue);
          this.ongoingDisposal = disposal;

          // Get routes
          const routes: any = await this.directionService.getRoutes(
            this.collectorCoords,
            this.householdCoords,
            [],
          );

          // TO DO: Handle unable route api

          if (routes && routes.routes.length) {
            let duration = routes.routes[0].legs[0].duration.text;
            this.note = `${duration}`;
          }
          this.directionDisplay.setDirections(routes);

          // Abangers
          this.locationService.getCollectorLocationWithinRadius(
            acceptedDetails.collectorId,
            acceptedDetails.disposalCoords
          );

          this.changeRef.detectChanges();
        });


    });

    this.locSub = this.locationService.isCollectorNearby$.subscribe(value => {
      if (value) {
        this.note = 'Your eco-aide has arrived.';
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  mapReady($event: any) {
    this.mapRef = $event;
    this.directionDisplay = this.directionService.getRenderer();
    this.directionDisplay.setMap(this.mapRef);
  }

  callCollector() {
    this.callNumber.callNumber(this.collector.contactNumber, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err))
    // TO DO: Show an alert box on error
  }

  async chatCollector() {
    const modal = await this.modalCtrl.create({
      component: ChatComponent,
      componentProps: {
        collector: this.collector,
        disposalId: this.ongoingDisposal.id,
      }
    });

    modal.present();
  }

  get collector(): Collector {
    return this.ongoingDisposal.collector;
  }

  get collectorCoords(): Coords {
    return this.ongoingDisposal.collectorCoords;
  }

  get householdCoords(): Coords {
    if (this.ongoingDisposal) {
      return this.ongoingDisposal.disposalLoc.coords;
    }
    return this.acceptDetails.disposalCoords;
  }
}
