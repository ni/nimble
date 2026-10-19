import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvSplitLayoutDirective } from './ok-fv-split-layout.directive';

import '@ni/ok-components/dist/esm/fv/split-layout';

@NgModule({
    declarations: [OkFvSplitLayoutDirective],
    imports: [CommonModule],
    exports: [OkFvSplitLayoutDirective]
})
export class OkFvSplitLayoutModule {}
