import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvFilterBarDirective } from './ok-fv-filter-bar.directive';

import '@ni/ok-components/dist/esm/fv/filter-bar';

@NgModule({
    declarations: [OkFvFilterBarDirective],
    imports: [CommonModule],
    exports: [OkFvFilterBarDirective]
})
export class OkFvFilterBarModule { }
