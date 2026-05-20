import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkFvSplitButtonDirective } from './ok-fv-split-button.directive';

import '@ni/ok-components/dist/esm/fv/split-button';

@NgModule({
    declarations: [OkFvSplitButtonDirective],
    imports: [CommonModule],
    exports: [OkFvSplitButtonDirective]
})
export class OkFvSplitButtonModule { }
