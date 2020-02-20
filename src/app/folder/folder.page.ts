import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TitleService } from '@core/services/title.service';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'app-folder',
    templateUrl: './folder.page.html',
    styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit, OnDestroy {

    public path: Observable<string>;
    public subscription: Subscription;

    public constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly titleService: TitleService,
    ) { }

    public ngOnInit(): void {
        this.initPath();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Initializes the path
    private initPath(): void {
        this.path = this.activatedRoute.queryParamMap.pipe(map(
            (params: ParamMap) => params.get('path')
        ));
        this.subscription = this.path.pipe(filter(title => !!title)).
            subscribe(title => {
                this.titleService.setTitle(title);
            });
    }
}
