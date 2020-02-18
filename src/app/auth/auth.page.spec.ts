import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { User } from '@shared/models/user';
import { SharedModule } from '@shared/shared.module';
import { of, throwError } from 'rxjs';
import { AuthPage } from './auth.page';


describe('AuthPage', () => {
    let component: AuthPage;
    let fixture: ComponentFixture<AuthPage>;

    let authSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let toastSpy: jasmine.SpyObj<ToastController>;

    beforeEach(async(() => {
        const auth = jasmine.createSpyObj(
            'AuthService', {
                login: of(true), getUser: of(null)
            }
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

        authSpy = TestBed.get(AuthService);
        routerSpy = TestBed.get(Router);
        toastSpy = TestBed.get(ToastController);
    }));

    it('should create', () => {
        fixture = TestBed.createComponent(AuthPage);
        component = fixture.componentInstance;
        expect(component).toBeTruthy();
        expect(authSpy.getUser).toHaveBeenCalledTimes(1);
    });

    it('should redirect if the user is authenticated', () => {
        authSpy.getUser.and.returnValue(of(new User('test', 'test')));
        TestBed.createComponent(AuthPage);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should be able to login', () => {
        fixture = TestBed.createComponent(AuthPage);
        component = fixture.componentInstance;
        component.login();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should be able to show an error message', () => {
        authSpy.login.and.returnValue(throwError('test error'));
        fixture = TestBed.createComponent(AuthPage);
        component = fixture.componentInstance;
        component.login();
        expect(toastSpy.create).toHaveBeenCalledTimes(1);
    });
});
