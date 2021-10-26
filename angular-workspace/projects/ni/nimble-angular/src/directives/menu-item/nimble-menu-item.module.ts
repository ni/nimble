import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleMenuItemDirective } from './nimble-menu-item.directive';

import '@ni/nimble-components/dist/esm/menu-item';

@NgModule({
    declarations: [NimbleMenuItemDirective],
    imports: [CommonModule],
    exports: [NimbleMenuItemDirective]
})
export class NimbleMenuItemModule { }
