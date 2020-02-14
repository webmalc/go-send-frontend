import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { DarkModeService } from './core/services/dark-mode.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public selectedIndex = 0;
    public darkMode = true;
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

    constructor(
        private readonly platform: Platform,
        private readonly splashScreen: SplashScreen,
        private readonly statusBar: StatusBar,
        private readonly darkModeService: DarkModeService,
    ) {
        this.initializeApp();
    }

    // Initializes the application
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.initDarkMode();
        });
    }

    // Initializes dark mode
    initDarkMode(): void {
        this.darkModeService.isDarkMode().then((mode: boolean) => {
            this.darkMode = mode;
        });
    }

    // Toggles the dark mode
    toggleDarkMode(): void {
        this.darkMode = this.darkModeService.toggle(this.darkMode);
    }

    ngOnInit() {
        const path = window.location.pathname.split('folder/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        }
    }
}
