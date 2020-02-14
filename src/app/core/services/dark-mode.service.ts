import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class DarkModeService {
    private readonly STORAGE_KEY = 'dark_mode';
    private readonly DEFAULT_MODE = true;

    constructor(private readonly storage: Storage) { }

    // Toggles dark mode
    toggle(mode: boolean): boolean {
        this.storage.set(this.STORAGE_KEY, !mode);

        return !mode;
    }

    // Returns if dark mode is enabled
    async isDarkMode(): Promise<boolean> {
        const mode = await this.storage.get(this.STORAGE_KEY);

        return mode === null ? this.DEFAULT_MODE : mode;
    }
}
