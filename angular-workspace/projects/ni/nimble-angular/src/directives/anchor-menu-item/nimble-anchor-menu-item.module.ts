import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorMenuItemDirective } from './nimble-anchor-menu-item.directive';

import '@ni/nimble-components/dist/esm/anchor-menu-item';

@NgModule({
    declarations: [NimbleAnchorMenuItemDirective],
    imports: [CommonModule],
    exports: [NimbleAnchorMenuItemDirective]
})
export class NimbleAnchorMenuItemModule { }
