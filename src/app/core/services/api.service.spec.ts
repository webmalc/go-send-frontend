import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Credentials } from '@shared/models/user';
import { of } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService', () => {

    let apiService: ApiService;
    let httpSpy: jasmine.SpyObj<HttpClient>;
    const credentials: Credentials = { username: 'user', password: 'pass' };

    beforeEach(() => {
        const http = jasmine.createSpyObj(
            'HttpClient', { get: of({ title: 'test' }) }
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

    it('should return the authentication headers', () => {
        const header = apiService.getAuthHeader(credentials);
        expect(header).toBe('Basic dXNlcjpwYXNz');
    });

    it('should ping the API', () => {
        apiService.ping(credentials).subscribe(result => {
            expect(httpSpy.get).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ title: 'test' });
        });
    });
});
