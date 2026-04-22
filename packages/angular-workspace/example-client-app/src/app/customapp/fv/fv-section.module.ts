import { NgModule } from '@angular/core';
import { OkFvAccordionItemModule } from '@ni/ok-angular/fv/accordion-item';
import { OkFvSearchInputModule } from 'ok-angular/fv-search-input/fv-search-input.module';
import { OkFvSearchInputSectionComponent } from '../ok-fv-search-input-section.component';
import { FvAccordionItemSectionComponent } from './fv-accordion-item-section.component';
import { FvSectionComponent } from './fv-section.component';
import { SubContainerModule } from '../sub-container/sub-container.module';

@NgModule({
    declarations: [FvSectionComponent, FvAccordionItemSectionComponent, OkFvSearchInputSectionComponent],
    imports: [OkFvAccordionItemModule, OkFvSearchInputModule, SubContainerModule],
    exports: [FvSectionComponent]
})
export class FvSectionModule { }
