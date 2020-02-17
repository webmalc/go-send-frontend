import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { User } from '@shared/models/user';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

type Guard = Observable<boolean | UrlTree>;

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    public constructor(
        private readonly router: Router,
        private readonly auth: AuthService,
    ) { }

    public canActivate(): Guard {

        return new Observable<boolean | UrlTree>(subscriber => {

            this.auth.user$.pipe(take(1)).subscribe((user: User) => {
                if (user) {
                    subscriber.next(true);
                } else {
                    subscriber.next(this.router.parseUrl('/auth/login'));
                }
                subscriber.complete();
            });
        });
    }

    public canActivateChild(): Guard {
        return this.canActivate();
    }
}
