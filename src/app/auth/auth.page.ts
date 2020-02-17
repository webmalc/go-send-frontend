import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Credentials } from '@shared/models/user';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

    public credentials: Credentials = {};

    public constructor(
        private readonly auth: AuthService,
        private readonly router: Router,
        private readonly toastController: ToastController,
    ) { }

    public login(): void {
        this.auth.login(this.credentials).subscribe(
            () => { this.redirect(); },
            () => { this.showError(); },
        );
    }

    public ngOnInit(): void {
        this.auth.user$.subscribe((user) => {
            if (user) {
                this.redirect();
            }
        });
    }

    // Redirect to the main page
    private redirect(): void {
        this.router.navigateByUrl('/');
    }

    // Show an error
    private async showError(): Promise<void> {
        const toast = await this.toastController.create({
            message: 'The username or password is incorrect.',
            color: 'danger',
            duration: 2000
        });
        toast.present();
    }

}
