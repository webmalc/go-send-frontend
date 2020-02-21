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
            'AuthService', { getUser: of(new User('user', 'pass')) }
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

    it('should permit authenticated users', inject(
        [AuthGuard], (guard: AuthGuard) => {
            guard.canActivate().subscribe(result => {
                expect(result).toBeTruthy();
                expect(authSpy.getUser).toHaveBeenCalledTimes(1);
            });
        }));

    it('should permit authenticated users from the child routes', inject(
        [AuthGuard], (guard: AuthGuard) => {
            guard.canActivateChild().subscribe(result => {
                expect(result).toBeTruthy();
                expect(authSpy.getUser).toHaveBeenCalledTimes(1);
            });
        }));

    it('should redirect unauthenticated users', inject(
        [AuthGuard], (guard: AuthGuard) => {
            authSpy.getUser.and.returnValue(of(null));
            guard.canActivate().subscribe(() => {
                expect(authSpy.getUser).toHaveBeenCalledTimes(1);
                expect(routerSpy.parseUrl).toHaveBeenCalledTimes(1);
                expect(routerSpy.parseUrl)
                    .toHaveBeenCalledWith('/auth/login');
            });
        }));
});
