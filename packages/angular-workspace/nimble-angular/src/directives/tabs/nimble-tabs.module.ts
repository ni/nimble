import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTabsDirective } from './nimble-tabs.directive';

import '@ni/nimble-components/dist/esm/tabs';

@NgModule({
    declarations: [NimbleTabsDirective],
    imports: [CommonModule],
    exports: [NimbleTabsDirective]
})
export class NimbleTabsModule { }
