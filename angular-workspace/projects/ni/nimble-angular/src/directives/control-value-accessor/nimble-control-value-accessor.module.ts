import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleBaseControlValueAccessor } from './nimble-control-value-accessor.directive';

@NgModule({
    declarations: [NimbleBaseControlValueAccessor],
    imports: [CommonModule],
    exports: []
})
export class NimbleControlValueAccessorModule { }
