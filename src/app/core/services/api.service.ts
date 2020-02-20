import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Dir } from '@shared/models/dir';
import { Credentials } from '@shared/models/user';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ApiService {

    public readonly baseUrl = environment.api;

    public constructor(private readonly http: HttpClient) { }

    // Returns the authentication header
    public getAuthHeader(credentials: Credentials): string {
        const token = `${credentials.username}:${credentials.password}`;

        return 'Basic ' + btoa(token);
    }

    // Tests the API
    public ping(credentials: Credentials): Observable<object> {
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: this.getAuthHeader(credentials)
            })
        };

        return this.http.get(this.baseUrl, httpOptions);
    }

    // Returns the directories
    public getDirs(path: string): Observable<Dir[]> {
        let params = new HttpParams();
        params = params.set('path', path && path[0] !== '/' ? path : '');

        return this.http.get(this.baseUrl, { params }).pipe(map(
            (result: object[]) => {
                return plainToClass(Dir, result);
            }));
    }

    // Toggles the directory sharing
    public toggleDir(path: string): Observable<Dir> {
        let params = new HttpParams();
        params = params.set('path', path && path[0] !== '/' ? path : '');
        const url = this.baseUrl + 'share';

        return this.http.get(url, { params }).pipe(map(
            (result: object) => {
                return plainToClass(Dir, result);
            }));
    }
}
