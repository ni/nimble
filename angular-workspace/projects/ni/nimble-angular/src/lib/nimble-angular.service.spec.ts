import { TestBed } from '@angular/core/testing';

import { NimbleAngularService } from './nimble-angular.service';

describe('NimbleAngularService', () => {
  let service: NimbleAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NimbleAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
