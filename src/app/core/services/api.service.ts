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

    // Tests the API
    ping(credentials: Credentials): Observable<object> {
        const authString = `${credentials.username}:${credentials.password}`;
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: 'Basic ' + btoa(authString)
            })
        };

        return this.http.get(this.baseUrl, httpOptions);
    }
}
