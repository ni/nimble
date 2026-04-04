import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkSearchInputDirective } from './ok-search-input.directive';

import '@ni/ok-components/dist/esm/search-input';

@NgModule({
    declarations: [OkSearchInputDirective],
    imports: [CommonModule],
    exports: [OkSearchInputDirective]
})
export class OkSearchInputModule { }