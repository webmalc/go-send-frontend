import { TestBed } from '@angular/core/testing';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { DarkModeService } from './dark-mode.service';

describe('DarkModeService', () => {

    let darkModeService: DarkModeService;
    let storageSpy: jasmine.SpyObj<Storage>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj(
            'Storage', { get: Promise.resolve(null), set: null }
        );
        TestBed.configureTestingModule({
            imports: [IonicStorageModule.forRoot()],
            providers: [
                DarkModeService,
                { provide: Storage, useValue: spy },
            ],
        });
        darkModeService = TestBed.get(DarkModeService);
        storageSpy = TestBed.get(Storage);
    });

    it('should be created', () => {
        expect(darkModeService).toBeTruthy();
    });

    it('should return true if there is no data in the storage', () => {
        darkModeService.isDarkMode().then((result) => {
            expect(storageSpy.get).toHaveBeenCalledTimes(1);
            expect(storageSpy.get).toHaveBeenCalledWith('dark_mode');
            expect(result).toBe(true);
        });
    });

    it('should return false if there is false in the storage', () => {
        storageSpy.get.and.returnValue(Promise.resolve(false));
        darkModeService.isDarkMode().then((result) => {
            expect(storageSpy.get).toHaveBeenCalledTimes(1);
            expect(storageSpy.get).toHaveBeenCalledWith('dark_mode');
            expect(result).toBe(false);
        });
    });

    it('should return true if there is true in the storage', () => {
        storageSpy.get.and.returnValue(Promise.resolve(true));
        darkModeService.isDarkMode().then((result) => {
            expect(storageSpy.get).toHaveBeenCalledTimes(1);
            expect(storageSpy.get).toHaveBeenCalledWith('dark_mode');
            expect(result).toBe(true);
        });
    });

    it('should toggle dark mode', () => {
        expect(darkModeService.toggle(false)).toBe(true);
        expect(storageSpy.set).toHaveBeenCalledWith('dark_mode', true);
        expect(darkModeService.toggle(true)).toBe(false);
        expect(storageSpy.set).toHaveBeenCalledWith('dark_mode', false);
        expect(storageSpy.set).toHaveBeenCalledTimes(2);
    });
});
