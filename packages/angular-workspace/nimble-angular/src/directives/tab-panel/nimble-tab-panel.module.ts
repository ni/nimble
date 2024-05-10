import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTabPanelDirective } from './nimble-tab-panel.directive';

import '@ni/nimble-components/dist/esm/tab-panel';

@NgModule({
    declarations: [NimbleTabPanelDirective],
    imports: [CommonModule],
    exports: [NimbleTabPanelDirective]
})
export class NimbleTabPanelModule { }
