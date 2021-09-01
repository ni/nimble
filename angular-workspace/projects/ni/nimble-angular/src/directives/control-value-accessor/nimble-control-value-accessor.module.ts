import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleControlValueAccessor } from './nimble-control-value-accessor.directive';

@NgModule({
    declarations: [
        NimbleControlValueAccessor
    ],
    imports: [
        CommonModule
    ],
    exports: [
        NimbleControlValueAccessor
    ]
})
export class NimbleControlValueAccessorModule { }
