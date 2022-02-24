import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleBreadcrumbDirective } from './nimble-breadcrumb.directive';

import '@ni/nimble-components/dist/esm/breadcrumb';

@NgModule({
    declarations: [NimbleBreadcrumbDirective],
    imports: [CommonModule],
    exports: [NimbleBreadcrumbDirective]
})
export class NimbleBreadcrumbModule { }
