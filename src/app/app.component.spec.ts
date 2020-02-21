import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@core/services/auth.service';
import { DarkModeService } from '@core/services/dark-mode.service';
import { TitleService } from '@core/services/title.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { User } from '@shared/models/user';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

import { DirMockComponent } from '@shared/mocks/dir.mock.component';

describe('AppComponent', () => {

    let statusBarSpy: jasmine.SpyObj<StatusBar>;
    let splashScreenSpy: jasmine.SpyObj<SplashScreen>;
    let platformSpy: jasmine.SpyObj<Platform>;
    let fixture: ComponentFixture<AppComponent>;
    let darkModeServiceSpy: jasmine.SpyObj<DarkModeService>;
    let authSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let titleSpy: jasmine.SpyObj<TitleService>;

    beforeEach(async(() => {
        const statusBar = jasmine.createSpyObj('StatusBar', ['styleDefault']);
        const splashScreen = jasmine.createSpyObj('SplashScreen', ['hide']);
        const platformJasmine = jasmine.createSpyObj(
            'Platform', { ready: Promise.resolve() }
        );
        const darkModeService = jasmine.createSpyObj(
            'DarkModeService',
            { isDarkMode: Promise.resolve(true), toggle: false },
        );
        const auth = jasmine.createSpyObj(
            'AuthService', {
            login: of(true),
            getUser: of(new User('user', 'pass')),
            logout: null,
        }
        );
        const title = jasmine.createSpyObj(
            'TitleService', { getTitle: of('test title') }
        );

        const router = jasmine.createSpyObj(
            'Router', ['navigateByUrl']
        );

        const activatedRoute = {
            queryParamMap: of(
                { get: jasmine.createSpy('params').and.returnValue('path') }
            )
        };

        TestBed.configureTestingModule({
            declarations: [AppComponent, DirMockComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: StatusBar, useValue: statusBar },
                { provide: SplashScreen, useValue: splashScreen },
                { provide: Platform, useValue: platformJasmine },
                { provide: DarkModeService, useValue: darkModeService },
                { provide: AuthService, useValue: auth },
                { provide: TitleService, useValue: title },
                { provide: Router, useValue: router },
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: ActivatedRoute, useValue: activatedRoute },
            ],
            imports: [
                RouterTestingModule.withRoutes([]),
                IonicStorageModule.forRoot(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        statusBarSpy = TestBed.get(StatusBar);
        splashScreenSpy = TestBed.get(SplashScreen);
        platformSpy = TestBed.get(Platform);
        authSpy = TestBed.get(AuthService);
        titleSpy = TestBed.get(TitleService);
        routerSpy = TestBed.get(Router);
        darkModeServiceSpy = TestBed.get(DarkModeService);
    }));

    it('should create the app', async () => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should initialize the app', async () => {
        expect(platformSpy.ready).toHaveBeenCalled();
        expect(statusBarSpy.styleDefault).toHaveBeenCalled();
        expect(splashScreenSpy.hide).toHaveBeenCalled();
        expect(darkModeServiceSpy.isDarkMode).toHaveBeenCalledTimes(1);
        expect(titleSpy.getTitle).toHaveBeenCalledTimes(1);
        expect(authSpy.getUser).toHaveBeenCalledTimes(1);
    });

    it('should have a title', async () => {
        const app = fixture.nativeElement;
        const titleTag = app.querySelector('ion-title') as HTMLElement;
        expect(titleTag.innerText).toBe('test title');
        expect(fixture.componentInstance.title).toBe('test title');
    });

    it('should have an user', async () => {
        expect(fixture.componentInstance.user.username).toBe('user');
    });

    it('should logout an user', async () => {
        fixture.componentInstance.logout();
        expect(fixture.componentInstance.user).toBeNull();
        expect(authSpy.logout).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth/login');
    });

    it('should update the path', async () => {
        fixture.componentInstance.path.subscribe((path: string) => {
            expect(path).toBe('path');
        });
    });

    it('should not update the path if the user is not authenticated',
        async () => {
            fixture.componentInstance.user = null;
            fixture.componentInstance.path.subscribe((path: string) => {
                expect(path).toBeFalsy();
            });
        });

    it('should toggle dark mode', async () => {
        let app = fixture.nativeElement;
        expect(app.querySelector('ion-app').getAttribute('class'))
            .toContain('dark');

        fixture.componentInstance.toggleDarkMode();
        fixture.detectChanges();

        app = fixture.nativeElement;
        expect(app.querySelector('ion-app').getAttribute('class'))
            .not.toContain('dark');
        expect(darkModeServiceSpy.toggle).toHaveBeenCalledTimes(1);
        expect(darkModeServiceSpy.toggle).toHaveBeenCalledWith(true);
    });
});
