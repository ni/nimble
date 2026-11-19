import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvTextFieldDirective } from './ok-fv-text-field.directive';

import '@ni/ok-components/dist/esm/fv/text-field';

@NgModule({
    declarations: [OkFvTextFieldDirective],
    imports: [CommonModule],
    exports: [OkFvTextFieldDirective]
})
export class OkFvTextFieldModule { }
