import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkAccordionItemDirective } from './ok-accordion-item.directive';

import '@ni/ok-components/dist/esm/accordion-item';

@NgModule({
    declarations: [OkAccordionItemDirective],
    imports: [CommonModule],
    exports: [OkAccordionItemDirective]
})
export class OkAccordionItemModule { }
