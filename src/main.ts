import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '@app/app.module';
import { environment } from '@environment/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';


if (environment.production) {
    enableProdMode();
}

// tslint:disable:no-console
platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
defineCustomElements(window);
