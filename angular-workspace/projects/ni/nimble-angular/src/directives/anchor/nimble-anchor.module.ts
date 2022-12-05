import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorDirective } from './nimble-anchor.directive';

import '@ni/nimble-components/dist/esm/anchor';

@NgModule({
    declarations: [NimbleAnchorDirective],
    imports: [CommonModule],
    exports: [NimbleAnchorDirective]
})
export class NimbleAnchorModule { }
