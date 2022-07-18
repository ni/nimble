import { NgModule } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NimbleDialogDirective } from './nimble-dialog.directive';

import '@ni/nimble-components/dist/esm/dialog';

@NgModule({
    declarations: [NimbleDialogDirective],
    imports: [
        CommonModule,
        PortalModule
    ],
    exports: [NimbleDialogDirective]
})
export class NimbleDialogModule { }
