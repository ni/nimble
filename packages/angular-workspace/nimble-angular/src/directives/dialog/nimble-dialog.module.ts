import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleDialogDirective } from './nimble-dialog.directive';

import '@ni/nimble-components/dist/esm/dialog';

@NgModule({
    declarations: [NimbleDialogDirective],
    imports: [
        CommonModule
    ],
    exports: [NimbleDialogDirective]
})
export class NimbleDialogModule { }
