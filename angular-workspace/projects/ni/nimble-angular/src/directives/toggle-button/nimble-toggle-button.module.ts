import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleToggleButtonDirective } from './nimble-toggle-button.directive';
import { NimbleToggleButtonControlValueAccessorDirective } from './nimble-toggle-button-control-value-accessor.directive';

import '@ni/nimble-components/dist/esm/toggle-button';

@NgModule({
    declarations: [NimbleToggleButtonDirective, NimbleToggleButtonControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleToggleButtonDirective, NimbleToggleButtonControlValueAccessorDirective]
})
export class NimbleToggleButtonModule { }
