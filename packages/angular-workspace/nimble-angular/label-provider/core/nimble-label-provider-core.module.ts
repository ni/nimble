import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleLabelProviderCoreDirective } from './nimble-label-provider-core.directive';
import { NimbleLabelProviderCoreWithDefaultsDirective } from './nimble-label-provider-core-with-defaults.directive';

import '@ni/nimble-components/dist/esm/label-provider/core';

@NgModule({
    declarations: [NimbleLabelProviderCoreDirective, NimbleLabelProviderCoreWithDefaultsDirective],
    imports: [
        CommonModule
    ],
    exports: [NimbleLabelProviderCoreDirective, NimbleLabelProviderCoreWithDefaultsDirective]
})
export class NimbleLabelProviderCoreModule { }
