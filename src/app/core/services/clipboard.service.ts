import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ClipboardService {

    private readonly ID = 'clipboard-copy-textarea';

    // Copy the provided text to the clipboard
    public copy(text: string): boolean {
        const el = document.createElement('textarea');
        el.value = text;
        el.id = this.ID;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        return !document.getElementById(this.ID);
    }
}
