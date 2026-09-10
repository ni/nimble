import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvSplitterDirective } from './ok-fv-splitter.directive';

import '@ni/ok-components/dist/esm/fv/splitter';

@NgModule({
    declarations: [OkFvSplitterDirective],
    imports: [CommonModule],
    exports: [OkFvSplitterDirective]
})
export class OkFvSplitterModule { }