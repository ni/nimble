import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkFvChipSelectorDirective } from './ok-fv-chip-selector.directive';

import '@ni/ok-components/dist/esm/fv/chip-selector';

@NgModule({
    declarations: [OkFvChipSelectorDirective],
    imports: [CommonModule],
    exports: [OkFvChipSelectorDirective]
})
export class OkFvChipSelectorModule { }
