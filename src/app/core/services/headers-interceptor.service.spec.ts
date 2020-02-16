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

    beforeEach(() => {
        const api = jasmine.createSpyObj(
            'ApiService', {
            baseUrl: "http://base.url/",
            getAuthHeader: 'Basic: token'
        }
        );
        const auth = jasmine.createSpyObj(
            'AuthService', { user$: of(new User('user', 'pass')) }
        );
        TestBed.configureTestingModule({
            providers: [
                HeadersInterceptor,
                { provide: ApiService, useValue: api },
                { provide: AuthService, useValue: auth },
            ],
        });
        headerIterceptor = TestBed.get(HeadersInterceptor);
        apiSpy = TestBed.get(ApiService);
        authSpy = TestBed.get(AuthService);
    });

    it('should be created', () => {
        expect(headerIterceptor).toBeTruthy();
    });
});
