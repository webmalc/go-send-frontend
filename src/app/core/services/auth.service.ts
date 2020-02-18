import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Storage } from '@ionic/storage';
import { Credentials, User } from '@shared/models/user';
import { BehaviorSubject, concat, from, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly STORAGE_KEY = 'auth';
    private readonly userSubject = new BehaviorSubject<User>(null);
    private user: User;

    public constructor(
        private readonly storage: Storage,
        private readonly api: ApiService,
    ) { }

    // Get the user observable
    public getUser(): Observable<User> {
        const fromStorage = from(this.loadUser());

        return concat(
            fromStorage, this.userSubject.asObservable().pipe(skip(1))
        );
    }

    // Logins a user
    public login(credentials: Credentials): Observable<boolean> {
        return this.api.ping(credentials).pipe(map(() => {
            this.user = new User(credentials.username, credentials.password);
            this.storage.set(this.STORAGE_KEY, this.user);
            this.notify();

            return true;
        }));
    }

    // Logout a user
    public logout(): void {
        this.user = null;
        this.storage.remove(this.STORAGE_KEY);
        this.notify();
    }

    // Notify the subscribers
    private notify(): void {
        this.userSubject.next(this.user);
    }

    // Load user from the storage
    private async loadUser(): Promise<User> {
        if (this.user) {
            return Promise.resolve(this.user);
        }
        const data = await this.storage.get(this.STORAGE_KEY);
        if (data) {
            this.user = new User(data.username, data.password);
        }

        return this.user;
    }
}
