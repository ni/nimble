import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkFvSplitButtonAnchorDirective } from './ok-fv-split-button-anchor.directive';

import '@ni/ok-components/dist/esm/fv/split-button-anchor';

@NgModule({
    declarations: [OkFvSplitButtonAnchorDirective],
    imports: [CommonModule],
    exports: [OkFvSplitButtonAnchorDirective]
})
export class OkFvSplitButtonAnchorModule { }
