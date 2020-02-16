import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Credentials } from '@shared/models/user';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ApiService {

    baseUrl = environment.api;

    constructor(private readonly http: HttpClient) { }

    // Returns the authentication header
    getAuthHeader(credentials: Credentials): string {
        const token = `${credentials.username}:${credentials.password}`;

        return 'Basic ' + btoa(token);
    }

    // Tests the API
    ping(credentials: Credentials): Observable<object> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.getAuthHeader(credentials)
            })
        };

        return this.http.get(this.baseUrl, httpOptions);
    }
}
