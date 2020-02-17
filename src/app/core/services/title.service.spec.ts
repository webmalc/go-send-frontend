import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { TitleService } from './title.service';

describe('TitleService', () => {

    const router = {
        events: of(new NavigationEnd(1, 'url', 'redirect'))
    };
    const activatedRoute = {
        firstChild: {
            outlet: 'primary',
            snapshot: { data: { title: 'test title' } }
        }
    };
    let titleService: TitleService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TitleService,
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: activatedRoute }
            ],
        });
        titleService = TestBed.get(TitleService);
    });

    it('should be created', async () => {
        expect(titleService).toBeTruthy();
    });

    it('should return the title as an observable', async () => {
        titleService.title$.subscribe((title) => {
            expect(title).toEqual('test title');
        });
    });

    it('should be able to set a new title', async () => {
        titleService.setTitle('new title');
        titleService.title$.subscribe((title) => {
            expect(title).toEqual('new title');
        });
    });

    it('should returns the default value', async () => {
        const routeWithoutTitle = JSON.parse(JSON.stringify(activatedRoute));
        routeWithoutTitle.firstChild.snapshot.data.title = null;
        TestBed.overrideProvider(
            ActivatedRoute, { useValue: routeWithoutTitle }
        );
        titleService = TestBed.get(TitleService);
        titleService.title$.subscribe((title: string) => {
            expect(title).toEqual('test title');
        });
    });
});
