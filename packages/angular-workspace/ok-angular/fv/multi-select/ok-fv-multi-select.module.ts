import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvMultiSelectDirective } from './ok-fv-multi-select.directive';

import '@ni/ok-components/dist/esm/fv/multi-select';

@NgModule({
    declarations: [OkFvMultiSelectDirective],
    imports: [CommonModule],
    exports: [OkFvMultiSelectDirective]
})
export class OkFvMultiSelectModule { }
