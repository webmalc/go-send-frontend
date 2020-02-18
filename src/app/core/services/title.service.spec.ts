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
    });

    it('should be created', async () => {
        titleService = TestBed.get(TitleService);
        expect(titleService).toBeTruthy();
    });

    it('should return the title as an observable', async () => {
        titleService = TestBed.get(TitleService);
        titleService.getTitle().subscribe((title) => {
            expect(title).toEqual('test title');
        });
    });

    it('should be able to set a new title', async () => {
        titleService = TestBed.get(TitleService);
        titleService.setTitle('new title');
        titleService.getTitle().subscribe((title) => {
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
        titleService.getTitle().subscribe((title: string) => {
            expect(title).toEqual('go-send');
        });
    });
});
