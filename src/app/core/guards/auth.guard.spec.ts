import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { User } from '@shared/models/user';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {

    let routerSpy: jasmine.SpyObj<Router>;
    let authSpy: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
        const router = jasmine.createSpyObj(
            'Router', ['parseUrl']
        );
        const auth = jasmine.createSpyObj(
            'AuthService', { user$: of(new User('user', 'pass')) }
        );
        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                { provide: AuthService, useValue: auth },
                { provide: Router, useValue: router },
            ],
        });
        authSpy = TestBed.get(AuthService);
        routerSpy = TestBed.get(Router);
    });

    it('should be created', inject([AuthGuard], (guard: AuthGuard) => {
        expect(guard).toBeTruthy();
    }));
});
