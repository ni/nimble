import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleLabelProviderTableDirective } from './nimble-label-provider-table.directive';
import { NimbleLabelProviderTableWithDefaultsDirective } from './nimble-label-provider-table-with-defaults.directive';

import '@ni/nimble-components/dist/esm/label-provider/table';

@NgModule({
    declarations: [NimbleLabelProviderTableDirective, NimbleLabelProviderTableWithDefaultsDirective],
    imports: [
        CommonModule
    ],
    exports: [NimbleLabelProviderTableDirective, NimbleLabelProviderTableWithDefaultsDirective]
})
export class NimbleLabelProviderTableModule { }
