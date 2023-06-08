import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleInternationalizationCoreDirective } from './nimble-i18n-core.directive';
import { NimbleInternationalizationCoreWithDefaultsDirective } from './nimble-i18n-core-with-defaults.directive';

import '@ni/nimble-components/dist/esm/i18n/core';

@NgModule({
    declarations: [NimbleInternationalizationCoreDirective, NimbleInternationalizationCoreWithDefaultsDirective],
    imports: [
        CommonModule
    ],
    exports: [NimbleInternationalizationCoreDirective, NimbleInternationalizationCoreWithDefaultsDirective]
})
export class NimbleInternationalizationCoreModule { }
