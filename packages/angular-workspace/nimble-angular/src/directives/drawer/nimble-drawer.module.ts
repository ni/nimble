import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleDrawerDirective } from './nimble-drawer.directive';

import '@ni/nimble-components/dist/esm/drawer';

@NgModule({
    declarations: [NimbleDrawerDirective],
    imports: [CommonModule],
    exports: [NimbleDrawerDirective]
})
export class NimbleDrawerModule { }
