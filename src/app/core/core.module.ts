import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
})
export class CoreModule {
    public constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule already loaded; Import in root module only.'
            );
        }
    }
}
