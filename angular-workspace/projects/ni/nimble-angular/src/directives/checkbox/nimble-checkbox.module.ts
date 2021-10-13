import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleCheckboxDirective } from './nimble-checkbox.directive';
import { NimbleCheckboxControlValueAccessorDirective } from './nimble-checkbox-control-value-accessor.directive';

import '@ni/nimble-components/dist/esm/checkbox';

@NgModule({
    declarations: [NimbleCheckboxDirective, NimbleCheckboxControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleCheckboxDirective, NimbleCheckboxControlValueAccessorDirective]
})
export class NimbleCheckboxModule { }
