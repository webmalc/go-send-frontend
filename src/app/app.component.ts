import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { DarkModeService } from '@core/services/dark-mode.service';
import { TitleService } from '@core/services/title.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { User } from '@shared/models/user';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy {

    public user: User;
    public darkMode = true;
    public title: string;
    public path: Observable<string>;

    private readonly subscriptions: Subscription[] = [];

    public constructor(
        private readonly platform: Platform,
        private readonly splashScreen: SplashScreen,
        private readonly statusBar: StatusBar,
        private readonly darkModeService: DarkModeService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly auth: AuthService,
        private readonly titleService: TitleService,
    ) {
        this.initializeApp();
    }

    // Reloads the window
    /* istanbul ignore next */
    public reload(): void {
        location.reload();
    }

    // Toggles the dark mode
    public toggleDarkMode(): void {
        this.darkMode = this.darkModeService.toggle(this.darkMode);
    }

    // Logouts the user
    public logout(): void {
        this.auth.logout();
        this.user = null;
        this.router.navigateByUrl('/auth/login');
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    // Initializes the application
    private initializeApp(): void {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.initDarkMode();
            this.initUser();
            this.initTitle();
            this.initPath();
        });
    }

    private initPath(): void {
        this.path = this.activatedRoute.queryParamMap.pipe(map(
            (params: ParamMap) => params.get('path')
        ), filter(() => !!this.user));
    }

    // Gets the title
    private initTitle(): void {
        this.subscriptions.push(
            this.titleService.getTitle().subscribe((title: string) => {
                this.title = title;
            })
        );
    }

    // Gets a user
    private initUser(): void {
        this.subscriptions.push(
            this.auth.getUser().subscribe(
                (user: User) => { this.user = user; }
            )
        );
    }

    // Initializes dark mode
    private initDarkMode(): void {
        this.darkModeService.isDarkMode().then((mode: boolean) => {
            this.darkMode = mode;
        });
    }

}
