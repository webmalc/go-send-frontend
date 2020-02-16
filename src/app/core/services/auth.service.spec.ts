import { TestBed } from '@angular/core/testing';
import { ApiService } from '@core/services/api.service';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { of } from 'rxjs';
import { AuthService } from './auth.service';


describe('AuthService', () => {

    let authService: AuthService;
    let storageSpy: jasmine.SpyObj<Storage>;
    let apiSpy: jasmine.SpyObj<ApiService>;

    beforeEach(() => {
        const storage = jasmine.createSpyObj(
            'Storage', { get: Promise.resolve(null), set: null }
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
});
