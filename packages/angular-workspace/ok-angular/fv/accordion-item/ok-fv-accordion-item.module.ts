import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkFvAccordionItemDirective } from './ok-fv-accordion-item.directive';

import '@ni/ok-components/dist/esm/fv/accordion-item';

@NgModule({
    declarations: [OkFvAccordionItemDirective],
    imports: [CommonModule],
    exports: [OkFvAccordionItemDirective]
})
export class OkFvAccordionItemModule { }
