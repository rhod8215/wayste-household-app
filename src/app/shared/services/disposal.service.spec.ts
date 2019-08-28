import { TestBed } from '@angular/core/testing';

import { DisposalService } from './disposal.service';

describe('DisposalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisposalService = TestBed.get(DisposalService);
    expect(service).toBeTruthy();
  });
});
