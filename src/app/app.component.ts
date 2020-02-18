import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { DarkModeService } from '@core/services/dark-mode.service';
import { TitleService } from '@core/services/title.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { User } from '@shared/models/user';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    public user: User;
    public selectedIndex = 0;
    public darkMode = true;
    public title: string;
    public appPages = [
        {
            title: 'Inbox',
            url: '/folder/Inbox',
            icon: 'mail'
        },
        {
            title: 'Outbox',
            url: '/folder/Outbox',
            icon: 'paper-plane'
        },
        {
            title: 'Favorites',
            url: '/folder/Favorites',
            icon: 'heart'
        },
        {
            title: 'Archived',
            url: '/folder/Archived',
            icon: 'archive'
        },
        {
            title: 'Trash',
            url: '/folder/Trash',
            icon: 'trash'
        },
        {
            title: 'Spam',
            url: '/folder/Spam',
            icon: 'warning'
        }
    ];

    private userSubscription: Subscription;

    public constructor(
        private readonly platform: Platform,
        private readonly splashScreen: SplashScreen,
        private readonly statusBar: StatusBar,
        private readonly darkModeService: DarkModeService,
        private readonly router: Router,
        private readonly auth: AuthService,
        private readonly titleService: TitleService,
    ) {
        this.initializeApp();
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

    public ngOnInit(): void {
        const path = window.location.pathname.split('folder/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(
                page => page.title.toLowerCase() === path.toLowerCase()
            );
        }
    }

    public ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }

    // Initializes the application
    private initializeApp(): void {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.initDarkMode();
            this.initUser();
            this.initTitle();
        });
    }

    // Gets the title
    private initTitle(): void {
        this.titleService.getTitle().subscribe((title: string) => {
            this.title = title;
        });
    }

    // Gets a user
    private initUser(): void {
        this.userSubscription = this.auth.getUser().subscribe(
            (user: User) => { this.user = user; }
        );
    }

    // Initializes dark mode
    private initDarkMode(): void {
        this.darkModeService.isDarkMode().then((mode: boolean) => {
            this.darkMode = mode;
        });
    }

}
