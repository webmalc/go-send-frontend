import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService', () => {

    let apiService: ApiService;
    let httpSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        const http = jasmine.createSpyObj(
            'HttpClient', { get: of([1, 2, 3]) }
        );
        TestBed.configureTestingModule({
            providers: [
                ApiService,
                { provide: HttpClient, useValue: http },
            ],
        });
        apiService = TestBed.get(ApiService);
        httpSpy = TestBed.get(HttpClient);
    });

    it('should be created', () => {
        expect(apiService).toBeTruthy();
    });
});
