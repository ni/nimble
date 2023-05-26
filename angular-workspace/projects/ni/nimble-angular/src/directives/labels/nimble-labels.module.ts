import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleThemeProviderInitializeAllLabelsDirective } from './nimble-theme-provider-initialize-all-labels.directive';

import '@ni/nimble-components/dist/esm/theme-provider';

@NgModule({
    declarations: [NimbleThemeProviderInitializeAllLabelsDirective],
    imports: [CommonModule],
    exports: [NimbleThemeProviderInitializeAllLabelsDirective]
})
export class NimbleLabelsModule { }
