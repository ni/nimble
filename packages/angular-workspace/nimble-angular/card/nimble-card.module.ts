import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleCardDirective } from './nimble-card.directive';

import '@ni/nimble-components/dist/esm/card';

@NgModule({
    declarations: [NimbleCardDirective],
    imports: [CommonModule],
    exports: [NimbleCardDirective]
})
export class NimbleCardModule { }
