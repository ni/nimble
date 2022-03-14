import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleSwitchDirective } from './nimble-switch.directive';
import { NimbleSwitchControlValueAccessorDirective } from './nimble-switch-control-value-accessor.directive';

import '@ni/nimble-components/dist/esm/switch';

@NgModule({
    declarations: [NimbleSwitchDirective, NimbleSwitchControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleSwitchDirective, NimbleSwitchControlValueAccessorDirective]
})
export class NimbleSwitchModule { }
