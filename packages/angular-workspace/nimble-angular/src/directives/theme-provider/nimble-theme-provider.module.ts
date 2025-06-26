import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleThemeProviderDirective } from './nimble-theme-provider.directive';

import '@ni/nimble-components/dist/esm/theme-provider';

@NgModule({
    declarations: [NimbleThemeProviderDirective],
    imports: [CommonModule],
    exports: [NimbleThemeProviderDirective]
})
export class NimbleThemeProviderModule { }
