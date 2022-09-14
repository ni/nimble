import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { RadioButton } from '@ni/nimble-components/dist/esm/radio-button';
import { NimbleRadioButtonDirective } from './nimble-radio-button.directive';

import '@ni/nimble-components/dist/esm/radio-button';

export type { RadioButton };

@NgModule({
    declarations: [NimbleRadioButtonDirective],
    imports: [CommonModule],
    exports: [NimbleRadioButtonDirective]
})
export class NimbleRadioButtonModule { }
