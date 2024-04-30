import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleToolbarDirective } from './nimble-toolbar.directive';

import '@ni/nimble-components/dist/esm/toolbar';

@NgModule({
    declarations: [NimbleToolbarDirective],
    imports: [CommonModule],
    exports: [NimbleToolbarDirective]
})
export class NimbleToolbarModule { }
