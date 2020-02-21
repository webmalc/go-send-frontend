import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TitleService } from '@core/services/title.service';
import { IonicModule } from '@ionic/angular';
import { DirMockComponent } from '@shared/mocks/dir.mock.component';
import { of } from 'rxjs';
import { FolderPage } from './folder.page';


describe('FolderPage', () => {
    let component: FolderPage;
    let fixture: ComponentFixture<FolderPage>;
    let paramsSpy: jasmine.Spy;

    beforeEach(async(() => {
        const title = jasmine.createSpyObj(
            'TitleService', { setTitle: of('test title') }
        );

        paramsSpy = jasmine.createSpy('paramsSpy');
        const activatedRoute = {
            queryParamMap: of({ get: () => paramsSpy })
        };
        TestBed.configureTestingModule({
            declarations: [FolderPage, DirMockComponent],
            imports: [
                IonicModule.forRoot(),
                RouterModule.forRoot([]),
            ],
            providers: [
                { provide: TitleService, useValue: title },
                { provide: ActivatedRoute, useValue: activatedRoute },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FolderPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
