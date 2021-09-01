import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleControlValueAccessorDirective } from './nimble-control-value-accessor.directive';

@NgModule({
    declarations: [
        NimbleControlValueAccessorDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        NimbleControlValueAccessorDirective
    ]
})
export class NimbleControlValueAccessorModule { }
