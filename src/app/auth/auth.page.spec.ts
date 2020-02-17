import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { User } from '@shared/models/user';
import { SharedModule } from '@shared/shared.module';
import { of } from 'rxjs';
import { AuthPage } from './auth.page';


describe('AuthPage', () => {
    let component: AuthPage;
    let fixture: ComponentFixture<AuthPage>;

    let authSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let toastSpy: jasmine.SpyObj<ToastController>;

    beforeEach(async(() => {
        const auth = jasmine.createSpyObj(
            'AuthService', { login: of(true) }
        );
        auth.user$ = jasmine.createSpyObj(
            'user$', { subscribe: of(new User('user', 'pass')) }
        );

        const router = jasmine.createSpyObj(
            'Router', ['navigateByUrl']
        );
        const toast = jasmine.createSpyObj(
            'ToastController', {
                create: Promise.resolve({ present: () => null })
            }
        );
        TestBed.configureTestingModule({
            declarations: [AuthPage],
            imports: [IonicModule.forRoot(), SharedModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: AuthService, useValue: auth },
                { provide: Router, useValue: router },
                { provide: ToastController, useValue: toast },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AuthPage);
        component = fixture.componentInstance;
        authSpy = TestBed.get(AuthService);
        routerSpy = TestBed.get(Router);
        toastSpy = TestBed.get(ToastController);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
