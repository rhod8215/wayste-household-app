import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackCollectorPage } from './track-collector.page';

describe('TrackCollectorPage', () => {
  let component: TrackCollectorPage;
  let fixture: ComponentFixture<TrackCollectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackCollectorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackCollectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
