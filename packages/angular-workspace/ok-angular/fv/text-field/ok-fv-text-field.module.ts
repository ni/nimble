import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvTextFieldDirective } from './ok-fv-text-field.directive';
import { OkFvTextFieldValueAccessor } from './ok-fv-text-field-value-accessor.directive';

import '@ni/ok-components/dist/esm/fv/text-field';

@NgModule({
    declarations: [OkFvTextFieldDirective, OkFvTextFieldValueAccessor],
    imports: [CommonModule],
    exports: [OkFvTextFieldDirective, OkFvTextFieldValueAccessor]
})
export class OkFvTextFieldModule { }
