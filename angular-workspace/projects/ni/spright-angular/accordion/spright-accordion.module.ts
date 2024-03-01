import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightAccordionDirective } from './spright-accordion.directive';

import '@ni/spright-components/dist/esm/accordion';

@NgModule({
    declarations: [SprightAccordionDirective],
    imports: [CommonModule],
    exports: [SprightAccordionDirective]
})
export class SprightAccordionModule { }
