import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTabsToolbarDirective } from './nimble-tabs-toolbar.directive';

import '@ni/nimble-components/dist/esm/tabs-toolbar';

@NgModule({
    declarations: [NimbleTabsToolbarDirective],
    imports: [CommonModule],
    exports: [NimbleTabsToolbarDirective]
})
export class NimbleTabsToolbarModule { }
