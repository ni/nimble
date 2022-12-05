import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorButtonDirective } from './nimble-anchor-button.directive';

import '@ni/nimble-components/dist/esm/anchor-button';

@NgModule({
    declarations: [NimbleAnchorButtonDirective],
    imports: [CommonModule],
    exports: [NimbleAnchorButtonDirective]
})
export class NimbleAnchorButtonModule { }
