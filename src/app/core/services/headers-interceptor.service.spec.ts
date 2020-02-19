import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@core/services/api.service';
import { AuthService } from '@core/services/auth.service';
import { User } from '@shared/models/user';
import { of } from 'rxjs';
import { HeadersInterceptor } from './headers-interceptor.service';

describe('HeadersInterceptor', () => {

    let headerIterceptor: HeadersInterceptor;
    let apiSpy: jasmine.SpyObj<ApiService>;
    let authSpy: jasmine.SpyObj<AuthService>;
    let handlerSpy: jasmine.SpyObj<HttpHandler>;

    beforeEach(() => {
        const api = jasmine.createSpyObj(
            'ApiService', {
            getAuthHeader: 'Basic token'
        });

        api.baseUrl = 'https://example.com/';
        const auth = jasmine.createSpyObj(
            'AuthService', { getUser: of(new User('user', 'pass')) }
        );
        const handler = jasmine.createSpyObj(
            'HttpHandler', { handle: of(new HttpResponse({ status: 123 })) }
        );

        TestBed.configureTestingModule({
            providers: [
                HeadersInterceptor,
                { provide: ApiService, useValue: api },
                { provide: AuthService, useValue: auth },
                { provide: HttpHandler, useValue: handler },
            ],
        });
        headerIterceptor = TestBed.get(HeadersInterceptor);
        apiSpy = TestBed.get(ApiService);
        authSpy = TestBed.get(AuthService);
        handlerSpy = TestBed.get(HttpHandler);
    });

    it('should be created', () => {
        expect(headerIterceptor).toBeTruthy();
    });

    it('should add the Authorization header', async () => {
        const request = new HttpRequest('GET', apiSpy.baseUrl + 'test/get');
        const requestSpy = spyOn(request, 'clone');

        headerIterceptor.intercept(request, handlerSpy).subscribe(
            (response: HttpResponse<string>) => {
                const h = requestSpy.calls.mostRecent().args[0].headers;
                expect(apiSpy.getAuthHeader).toHaveBeenCalledTimes(1);
                expect(authSpy.getUser).toHaveBeenCalledTimes(1);
                expect(handlerSpy.handle).toHaveBeenCalledTimes(1);
                expect(requestSpy).toHaveBeenCalledTimes(1);
                expect(h.get('Authorization')).toBe('Basic token');
                expect(h.get('Content-type')).toBe('application/json');
                expect(response.status).toBe(123);
            });
    });

    it('should add the Content-type header', async () => {
        const request = new HttpRequest('GET', apiSpy.baseUrl + 'test/get');
        const requestSpy = spyOn(request, 'clone');
        authSpy.getUser.and.returnValue(of(null));

        headerIterceptor.intercept(request, handlerSpy).subscribe(
            (response: HttpResponse<string>) => {
                const h = requestSpy.calls.mostRecent().args[0].headers;
                expect(apiSpy.getAuthHeader).not.toHaveBeenCalled();
                expect(authSpy.getUser).toHaveBeenCalledTimes(1);
                expect(handlerSpy.handle).toHaveBeenCalledTimes(1);
                expect(requestSpy).toHaveBeenCalledTimes(1);
                expect(h.get('Authorization')).toBeFalsy();
                expect(h.get('Content-type')).toBe('application/json');
                expect(response.status).toBe(123);
            });
    });

    it('should skip URLs from a host other than the base host', async () => {
        const request = new HttpRequest('GET', 'http://other.com');
        headerIterceptor.intercept(request, handlerSpy).subscribe(() => {
            expect(apiSpy.getAuthHeader).not.toHaveBeenCalled();
            expect(authSpy.getUser).not.toHaveBeenCalled();
        });
    });

    it('should skip URLs when an error occurs', async () => {
        const request = new HttpRequest('GET', 'invalid url');
        headerIterceptor.intercept(request, handlerSpy).subscribe(() => {
            expect(apiSpy.getAuthHeader).not.toHaveBeenCalled();
            expect(authSpy.getUser).not.toHaveBeenCalled();
        });
    });
});
