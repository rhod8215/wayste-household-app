import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  dateNow(): Date {
    return new Date();
  }

  getFormattedDateNow(): string {
    return moment().format('DDMMMYYYY');
  }

  stringToDate(dateString: string): Date {
    return new Date(dateString);
  }
}
