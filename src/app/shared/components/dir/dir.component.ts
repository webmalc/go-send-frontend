import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { ClipboardService } from '@core/services/clipboard.service';
import { ToastController } from '@ionic/angular';
import { Dir } from '@shared/models/dir';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-dir',
    templateUrl: './dir.component.html',
    styleUrls: ['./dir.component.scss'],
    providers: [
        ApiService,
        ClipboardService,
    ],
})
export class DirComponent implements OnInit, OnDestroy {

    @Input() public parent = false;
    @Input() public path: Observable<string>;

    public dirs: Dir[] = [];
    public filteredDirs: Dir[] = [];
    public parentPath: string;
    public currentPath: string;
    public loading = false;
    public query: string;

    private subscription: Subscription;

    public constructor(
        private readonly api: ApiService,
        private readonly toastController: ToastController,
        private readonly clipboard: ClipboardService,
    ) { }

    public ngOnInit(): void {
        this.subscription = this.path.pipe(map(path => this.setPaths(path)))
            .subscribe((path: string) => this.getDirs(path));
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Filters the directories
    public filterDirs(): void {
        if (!this.dirs || !this.query) {
            this.filteredDirs = this.dirs;

            return;
        }
        this.filteredDirs = this.dirs.filter(dir => {
            return dir.relativePath.toLowerCase()
                .indexOf(this.query.toLowerCase()) > -1;
        });
    }

    // Toggles folder sharing
    public toggleDir(dir: Dir): void {
        dir.loading = true;
        this.api.toggleDir(dir.relativePath).subscribe((respone: Dir) => {
            Object.assign(dir, respone);
        }, () => {
            this.showError();
        }, () => dir.loading = false);
    }

    // Toggles folder sharing
    public async showLink(url: string): Promise<void> {
        this.clipboard.copy(url);
        const toast = await this.toastController.create({
            header: 'The link to the directory has been copied.',
            message: url,
            cssClass: 'wide',
            duration: 4000,
            buttons: [
                {
                    icon: 'close-circle',
                    role: 'cancel',
                    handler: () => {
                        toast.dismiss();
                    }
                }
            ]
        });
        toast.present();
    }

    // Sets the parent and current path
    private setPaths(path: string): string {
        if (path) {
            const temp = path.slice(0, -1);
            this.parentPath = temp.substring(0, temp.lastIndexOf('/') + 1);
        }
        this.currentPath = this.parent ? this.parentPath : path;

        return this.currentPath;
    }

    // Retrieve the directories
    private getDirs(path: string): void {
        this.loading = true;
        this.dirs = [];
        this.filteredDirs = [];
        this.query = null;
        this.api.getDirs(path).subscribe(dirs => {
            this.dirs = dirs;
            this.filterDirs();
        }, () => {
            this.showError();
        }, () => this.loading = false);
    }

    // Show an error
    private async showError(): Promise<void> {
        const toast = await this.toastController.create({
            message: 'An error has occurred while retrieving directories.',
            color: 'danger',
            duration: 3000,
            buttons: [
                {
                    icon: 'close-circle',
                    role: 'cancel',
                    handler: () => {
                        window.location.reload();
                    }
                }
            ]
        });
        toast.present();
    }
}
