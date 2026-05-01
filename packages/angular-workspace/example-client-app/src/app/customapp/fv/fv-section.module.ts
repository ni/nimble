import { NgModule } from '@angular/core';
import { OkFvAccordionItemModule } from '@ni/ok-angular/fv/accordion-item';
import { OkFvSearchInputModule } from '@ni/ok-angular/fv/search-input';
import { FvAccordionItemSectionComponent } from './fv-accordion-item-section.component';
import { FvSearchInputSectionComponent } from './fv-search-input-section.component';
import { FvSectionComponent } from './fv-section.component';
import { SubContainerModule } from '../sub-container/sub-container.module';

@NgModule({
    declarations: [FvSectionComponent, FvAccordionItemSectionComponent, FvSearchInputSectionComponent],
    imports: [OkFvAccordionItemModule, OkFvSearchInputModule, SubContainerModule],
    exports: [FvSectionComponent]
})
export class FvSectionModule { }
