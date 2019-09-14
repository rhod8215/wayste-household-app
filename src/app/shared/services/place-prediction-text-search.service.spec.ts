import { TestBed } from '@angular/core/testing';

import { PlacePredictionTextSearchService } from './place-prediction-text-search.service';

describe('PlacePredictionTextSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlacePredictionTextSearchService = TestBed.get(PlacePredictionTextSearchService);
    expect(service).toBeTruthy();
  });
});
