import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkFvStickyHeaderDirective } from './ok-fv-sticky-header.directive';

import '@ni/ok-components/dist/esm/fv/sticky-header';

@NgModule({
    declarations: [OkFvStickyHeaderDirective],
    imports: [CommonModule],
    exports: [OkFvStickyHeaderDirective]
})
export class OkFvStickyHeaderModule { }
