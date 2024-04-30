import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTooltipDirective } from './nimble-tooltip.directive';

import '@ni/nimble-components/dist/esm/tooltip';

@NgModule({
    declarations: [NimbleTooltipDirective],
    imports: [CommonModule],
    exports: [NimbleTooltipDirective]
})
export class NimbleTooltipModule { }