import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { AuthService } from '@core/services/auth.service';
import { User } from '@shared/models/user';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

// Sets headers for the processed request
@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    public constructor(
        private readonly auth: AuthService,
        private readonly api: ApiService,
    ) { }

    // Intercepts requests
    public intercept(
        req: HttpRequest<any>, next: HttpHandler
    ): Observable<HttpEvent<any>> {
        try {
            if (!this.isApiUrl(req.url)) {
                return next.handle(req);
            }
        } catch (e) {
            return next.handle(req);
        }

        return this.auth.getUser().pipe(take(1)).pipe(
            switchMap((user: User) => {
                let headers = req.headers
                    .append('Content-Type', 'application/json');

                if (user) {
                    headers = headers.set(
                        'Authorization', this.api.getAuthHeader(user)
                    );
                }

                return next.handle(req.clone({ headers }));
            }));
    }

    // Checks if the request URL belongs the API
    private isApiUrl(url: string): boolean {
        const requestUrl = new URL(url);
        const apiUrl = new URL(this.api.baseUrl);

        return requestUrl.origin === apiUrl.origin;
    }

}
