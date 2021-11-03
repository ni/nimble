import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleMenuDirective } from './nimble-menu.directive';

import '@ni/nimble-components/dist/esm/menu';

@NgModule({
    declarations: [NimbleMenuDirective],
    imports: [CommonModule],
    exports: [NimbleMenuDirective]
})
export class NimbleMenuModule { }
