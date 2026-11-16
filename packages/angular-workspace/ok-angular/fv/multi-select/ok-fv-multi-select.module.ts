import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvMultiSelectDirective } from './ok-fv-multi-select.directive';
import { OkFvMultiSelectValueAccessor } from './ok-fv-multi-select-value-accessor.directive';

import '@ni/ok-components/dist/esm/fv/multi-select';

@NgModule({
    declarations: [OkFvMultiSelectDirective, OkFvMultiSelectValueAccessor],
    imports: [CommonModule],
    exports: [OkFvMultiSelectDirective, OkFvMultiSelectValueAccessor]
})
export class OkFvMultiSelectModule { }
