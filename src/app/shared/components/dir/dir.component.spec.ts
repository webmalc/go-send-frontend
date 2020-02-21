import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from '@core/services/api.service';
import { ClipboardService } from '@core/services/clipboard.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { Dir } from '@shared/models/dir';
import { of } from 'rxjs';
import { DirComponent } from './dir.component';

describe('DirComponent', () => {
    let component: DirComponent;
    let fixture: ComponentFixture<DirComponent>;
    let apiSpy: jasmine.SpyObj<ApiService>;
    let toastSpy: jasmine.SpyObj<ToastController>;
    let dirs: Dir[];
    let dir1: Dir;
    let dir2: Dir;

    beforeEach(async(() => {
        dir1 = new Dir();
        dir1.relativePath = 'path';
        dir1.hash = 'hash';
        dir2 = new Dir();
        dir2.relativePath = 'another path';
        dirs = [dir1, dir2];
        const api = jasmine.createSpyObj(
            'ApiService', { getDirs: of(dirs), toggleDir: of(dir1) }
        );
        const toast = jasmine.createSpyObj(
            'ToastController', {
            create: Promise.resolve({ present: () => null })
        }
        );
        const clipboard = jasmine.createSpyObj(
            'ClipboardService', ['copy']
        );
        TestBed.configureTestingModule({
            declarations: [DirComponent],
            imports: [
                IonicModule.forRoot(),
                FormsModule,
                RouterTestingModule,
                HttpClientTestingModule
            ],
            providers: [
                { provide: ApiService, useValue: api },
                { provide: ToastController, useValue: toast },
                { provide: ClipboardService, useValue: clipboard },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(DirComponent);
        component = fixture.componentInstance;
        component.path = of('path/to/dir/');
        apiSpy = TestBed.get(ApiService);
        toastSpy = TestBed.get(ToastController);
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call get directories', async () => {
        component.path.subscribe((path: string) => {
            expect(component.loading).toBeTruthy();
            expect(component.query).toBeNull();
            expect(component.dirs).toEqual([]);
            expect(component.filteredDirs).toEqual([]);
            expect(component.currentPath).toEqual(path);
            expect(component.parentPath).toEqual('path/to/');
        });
    });

    it('should filter directories', async () => {
        component.dirs = dirs;
        component.query = 'another';
        component.filterDirs();
        expect(component.filteredDirs).toEqual([dir2]);
    });

    it('should filter the empty directories', async () => {
        component.dirs = [];
        component.query = '';
        component.filterDirs();
        expect(component.filteredDirs).toEqual([]);
    });

    it('should be able to toggle the directory sharing', async () => {
        component.toggleDir(dir1);
    });

    it('should be able show the directory link', async () => {
        const url = 'test url';
        component.showLink(url).then(() => {
            expect(toastSpy.create).toHaveBeenCalledTimes(1);
        });
    });

});
