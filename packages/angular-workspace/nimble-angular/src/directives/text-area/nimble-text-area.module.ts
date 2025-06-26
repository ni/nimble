import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NimbleTextAreaDirective } from './nimble-text-area.directive';
import { NimbleTextAreaControlValueAccessorDirective } from './nimble-text-area-control-value-accessor.directive';

import '@ni/nimble-components/dist/esm/text-area';

@NgModule({
    declarations: [NimbleTextAreaDirective, NimbleTextAreaControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleTextAreaDirective, NimbleTextAreaControlValueAccessorDirective]
})
export class NimbleTextAreaModule {}
