import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class TitleService {

    public DEFAULT_TITLE = 'go-send';
    private readonly title = new BehaviorSubject<string>(this.DEFAULT_TITLE);
    private readonly title$: Observable<string> = this.title.asObservable();

    public constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) {
        this.initRouterTitle();
    }

    // Get the title observable
    public getTitle(): Observable<string> {
        return this.title$;
    }

    // Sets title
    public setTitle(title: string): void {
        this.getTitle().pipe(filter(t => t !== title), take(2))
            .subscribe(() => {
                this.title.next(title);
            });
    }

    // Gets title from the router
    private initRouterTitle(): void {
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map(
                (route) => {
                    while (route.firstChild) {
                        route = route.firstChild;
                    }

                    return route;
                }
            ),
            filter((route) => route.outlet === 'primary'),
            map(
                (route) => {
                    const routeTitle = route.snapshot.data.title as string;

                    return routeTitle || this.DEFAULT_TITLE;
                }
            )
        ).subscribe((title: string) => this.title.next(title));
    }
}
