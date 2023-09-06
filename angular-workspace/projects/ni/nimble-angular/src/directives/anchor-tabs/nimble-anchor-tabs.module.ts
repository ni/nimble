import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorTabsDirective } from './nimble-anchor-tabs.directive';

import '@ni/nimble-components/dist/esm/anchor-tabs';

@NgModule({
    declarations: [NimbleAnchorTabsDirective],
    imports: [CommonModule],
    exports: [NimbleAnchorTabsDirective]
})
export class NimbleAnchorTabsModule { }
