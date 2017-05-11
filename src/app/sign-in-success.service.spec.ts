import { TestBed, inject } from '@angular/core/testing';

import { SignInSuccessService } from './sign-in-success.service';

describe('SignInSuccessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignInSuccessService]
    });
  });

  it('should ...', inject([SignInSuccessService], (service: SignInSuccessService) => {
    expect(service).toBeTruthy();
  }));
});
