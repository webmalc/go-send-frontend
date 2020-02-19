import { TestBed } from '@angular/core/testing';
import { ApiService } from '@core/services/api.service';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { User } from '@shared/models/user';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from './auth.service';


describe('AuthService', () => {

    let authService: AuthService;
    let storageSpy: jasmine.SpyObj<Storage>;
    let apiSpy: jasmine.SpyObj<ApiService>;

    beforeEach(() => {
        const storage = jasmine.createSpyObj(
            'Storage', { get: Promise.resolve(null), set: null, remove: null }
        );
        const api = jasmine.createSpyObj(
            'ApiService', { ping: of({ username: 'user', password: 'pass' }) }
        );
        TestBed.configureTestingModule({
            imports: [IonicStorageModule.forRoot()],
            providers: [
                AuthService,
                { provide: Storage, useValue: storage },
                { provide: ApiService, useValue: api },
            ],
        });
        authService = TestBed.get(AuthService);
        storageSpy = TestBed.get(Storage);
        apiSpy = TestBed.get(ApiService);
    });

    it('should be created', () => {
        expect(authService).toBeTruthy();
    });

    it('user should be undefined by default', async () => {
        authService.getUser().pipe(take(1)).subscribe(user => {
            expect(user).toBeUndefined();
        });
    });

    it('user load user from the storage', async () => {
        const expectedUser = new User('expected', 'pass');
        storageSpy.get.and.returnValue(Promise.resolve(expectedUser));
        authService.getUser().subscribe(user => {
            expect(storageSpy.get).toHaveBeenCalledTimes(1);
            expect(storageSpy.get).toHaveBeenCalledWith('auth');
            expect(user).toEqual(expectedUser);
        });
    });

    it('should be able to login', async () => {
        const credentials = new User('test', 'pass');

        authService.login(credentials).subscribe(value => {
            expect(apiSpy.ping).toHaveBeenCalledTimes(1);
            expect(storageSpy.set).toHaveBeenCalledTimes(1);
            expect(storageSpy.set).toHaveBeenCalledWith('auth', credentials);
            expect(value).toBeTruthy();
        });

        authService.getUser().subscribe(user => {
            expect(user).toEqual(credentials);
        });
    });

    it('should be able to logout', async () => {
        authService.logout();
        expect(storageSpy.remove).toHaveBeenCalledTimes(1);
        expect(storageSpy.remove).toHaveBeenCalledWith('auth');
    });
});
