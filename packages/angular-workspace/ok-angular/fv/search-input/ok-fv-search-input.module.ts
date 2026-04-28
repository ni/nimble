import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvSearchInputDirective } from './ok-fv-search-input.directive';

import '@ni/ok-components/dist/esm/fv/search-input';

@NgModule({
    declarations: [OkFvSearchInputDirective],
    imports: [CommonModule],
    exports: [OkFvSearchInputDirective]
})
export class OkFvSearchInputModule { }