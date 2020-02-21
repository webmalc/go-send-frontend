import { HttpClient, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Dir } from '@shared/models/dir';
import { Credentials } from '@shared/models/user';
import { of } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService', () => {

    const credentials: Credentials = { username: 'user', password: 'pass' };
    let apiService: ApiService;
    let httpSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        const http = jasmine.createSpyObj(
            'HttpClient', { get: of({ title: 'test' }) }
        );
        TestBed.configureTestingModule({
            providers: [
                ApiService,
                { provide: HttpClient, useValue: http },
            ],
        });
        apiService = TestBed.get(ApiService);
        httpSpy = TestBed.get(HttpClient);
    });

    it('should be created', () => {
        expect(apiService).toBeTruthy();
    });

    it('should return the authentication headers', () => {
        const header = apiService.getAuthHeader(credentials);
        expect(header).toBe('Basic dXNlcjpwYXNz');
    });

    it('should ping the API', () => {
        apiService.ping(credentials).subscribe(result => {
            expect(httpSpy.get).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ title: 'test' });
        });
    });

    it('should be able to get a list of directories', async () => {
        httpSpy.get.and.returnValue(of([{
            path: 'test path',
            relative_path: 'relative path'
        }]));
        apiService.getDirs('dirs/path').subscribe(dirs => {
            const args = httpSpy.get.calls.mostRecent().args;
            expect(httpSpy.get).toHaveBeenCalledTimes(1);
            expect(args[1].params.toString()).toBe('path=dirs/path');
            expect(dirs[0]).toEqual(jasmine.any(Dir));
            expect(dirs[0].path).toBe('test path');
            expect(dirs[0].relativePath).toBe('relative path');
        });
    });

    it('should be able to toggle directory sharing', async () => {
        httpSpy.get.and.returnValue(of({
            path: 'test path',
            relative_path: 'relative path',
            hash: 'hash'
        }));
        apiService.toggleDir('dir/path').subscribe(dir => {
            const args = httpSpy.get.calls.mostRecent().args;
            expect(httpSpy.get).toHaveBeenCalledTimes(1);
            expect(args[0]).toContain('share');
            expect(args[1].params.toString()).toBe('path=dir/path');
            expect(dir).toEqual(jasmine.any(Dir));
            expect(dir.path).toBe('test path');
            expect(dir.relativePath).toBe('relative path');
            expect(dir.hash).toBe('hash');
        });
    });

    it('should be able to convert path', async () => {
        apiService.getDirs('/').subscribe(() => {
            const args = httpSpy.get.calls.mostRecent().args;
            expect(args[1].params.toString()).toBe('path=');
        });

        apiService.toggleDir('').subscribe(() => {
            const args = httpSpy.get.calls.mostRecent().args;
            expect(args[1].params.toString()).toBe('path=');
        });
    });
});
