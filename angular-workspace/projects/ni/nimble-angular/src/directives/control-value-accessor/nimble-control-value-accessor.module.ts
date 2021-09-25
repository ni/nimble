import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleDefaultControlValueAccessor } from './nimble-default-control-value-accessor.directive';

@NgModule({
    declarations: [NimbleDefaultControlValueAccessor],
    imports: [CommonModule],
    exports: [NimbleDefaultControlValueAccessor]
})
export class NimbleControlValueAccessorModule { }
