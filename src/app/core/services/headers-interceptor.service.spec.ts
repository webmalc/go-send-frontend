import { TestBed } from '@angular/core/testing';

import { HeadersInterceptorService } from './headers-interceptor.service';

describe('HeadersInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeadersInterceptorService = TestBed.get(HeadersInterceptorService);
    expect(service).toBeTruthy();
  });
});
