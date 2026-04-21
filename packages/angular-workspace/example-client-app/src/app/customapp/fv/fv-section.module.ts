import { NgModule } from '@angular/core';
import { OkFvAccordionItemModule } from '@ni/ok-angular/fv/accordion-item';
import { FvAccordionItemSectionComponent } from './fv-accordion-item-section.component';
import { FvSectionComponent } from './fv-section.component';
import { SubContainerModule } from '../sub-container/sub-container.module';

@NgModule({
    declarations: [FvSectionComponent, FvAccordionItemSectionComponent],
    imports: [OkFvAccordionItemModule, SubContainerModule],
    exports: [FvSectionComponent]
})
export class FvSectionModule { }
