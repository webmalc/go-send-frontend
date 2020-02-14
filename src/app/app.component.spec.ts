import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { AppComponent } from './app.component';
import { DarkModeService } from './core/services/dark-mode.service';

describe('AppComponent', () => {

    let statusBarSpy: jasmine.SpyObj<StatusBar>;
    let splashScreenSpy: jasmine.SpyObj<SplashScreen>;
    let platformSpy: jasmine.SpyObj<Platform>;
    let fixture: ComponentFixture<AppComponent>;
    let darkModeServiceSpy: jasmine.SpyObj<DarkModeService>;

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

        TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: StatusBar, useValue: statusBar },
                { provide: SplashScreen, useValue: splashScreen },
                { provide: Platform, useValue: platformJasmine },
                { provide: DarkModeService, useValue: darkModeService },
                { provide: ComponentFixtureAutoDetect, useValue: true },
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
    });

    it('should have menu labels', async () => {
        const app = fixture.nativeElement;
        const menuItems = app.querySelectorAll('ion-label');
        expect(menuItems.length).toEqual(7);
        expect(menuItems[1].textContent).toContain('Inbox');
        expect(menuItems[2].textContent).toContain('Outbox');
    });

    it('should have urls', async () => {
        const app = fixture.nativeElement;
        const menuItems = app.querySelectorAll('ion-item');
        expect(menuItems.length).toEqual(7);
        expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/folder/Inbox');
        expect(menuItems[2].getAttribute('ng-reflect-router-link')).toEqual('/folder/Outbox');
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
