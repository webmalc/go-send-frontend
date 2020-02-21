import { TestBed } from '@angular/core/testing';

import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
    let copy: ClipboardService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        copy = TestBed.get(ClipboardService);
    });

    it('should be created', () => {
        expect(copy).toBeTruthy();
    });

    it('should copy the provided text to the clipboard', async () => {
        expect(copy.copy('some text')).toBe(true);
        expect(document.getElementById('clipboard-copy-textarea')).toBeFalsy();
    });
});
