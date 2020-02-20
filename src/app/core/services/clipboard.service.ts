import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ClipboardService {

    // Copy the provided text to the clipboard
    public copy(text: string): void {
        const el = document.createElement('textarea');
        el.value = text;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }
}
