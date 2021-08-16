import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import '@ni/nimble-components/dist/esm/src/button';
import '@ni/nimble-components/dist/esm/src/theme-provider';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
// eslint-disable-next-line no-console
    .catch(err => console.error(err));
