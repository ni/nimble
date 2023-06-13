import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleInternationalizationTableDirective } from './nimble-i18n-table.directive';
import { NimbleInternationalizationTableWithDefaultsDirective } from './nimble-i18n-table-with-defaults.directive';

import '@ni/nimble-components/dist/esm/i18n/table';

@NgModule({
    declarations: [NimbleInternationalizationTableDirective, NimbleInternationalizationTableWithDefaultsDirective],
    imports: [
        CommonModule
    ],
    exports: [NimbleInternationalizationTableDirective, NimbleInternationalizationTableWithDefaultsDirective]
})
export class NimbleInternationalizationTableModule { }
