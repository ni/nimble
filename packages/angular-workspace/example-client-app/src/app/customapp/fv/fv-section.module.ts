import { NgModule } from '@angular/core';
import { NimbleMenuItemModule, NimbleMenuModule } from '@ni/nimble-angular';
import { OkFvAccordionItemModule } from '@ni/ok-angular/fv/accordion-item';
import { OkFvCardModule } from '@ni/ok-angular/fv/card';
import { OkFvChipSelectorModule } from '@ni/ok-angular/fv/chip-selector';
import { OkFvContextHelpModule } from '@ni/ok-angular/fv/context-help';
import { OkFvSearchInputModule } from '@ni/ok-angular/fv/search-input';
import { OkFvSplitButtonAnchorModule } from '@ni/ok-angular/fv/split-button-anchor';
import { OkFvSplitButtonModule } from '@ni/ok-angular/fv/split-button';
import { OkFvSummaryPanelModule } from '@ni/ok-angular/fv/summary-panel';
import { OkFvSummaryPanelTileModule } from '@ni/ok-angular/fv/summary-panel-tile';
import { FvAccordionItemSectionComponent } from './fv-accordion-item-section.component';
import { FvCardSectionComponent } from './fv-card-section.component';
import { FvChipSelectorSectionComponent } from './fv-chip-selector-section.component';
import { FvContextHelpSectionComponent } from './fv-context-help-section.component';
import { FvSearchInputSectionComponent } from './fv-search-input-section.component';
import { FvSectionComponent } from './fv-section.component';
import { FvSplitButtonAnchorSectionComponent } from './fv-split-button-anchor-section.component';
import { FvSplitButtonSectionComponent } from './fv-split-button-section.component';
import { FvSummaryPanelSectionComponent } from './fv-summary-panel-section.component';
import { SubContainerModule } from '../sub-container/sub-container.module';

@NgModule({
    declarations: [
        FvSectionComponent,
        FvAccordionItemSectionComponent,
        FvCardSectionComponent,
        FvChipSelectorSectionComponent,
        FvContextHelpSectionComponent,
        FvSearchInputSectionComponent,
        FvSplitButtonSectionComponent,
        FvSplitButtonAnchorSectionComponent,
        FvSummaryPanelSectionComponent
    ],
    imports: [
        NimbleMenuModule,
        NimbleMenuItemModule,
        OkFvAccordionItemModule,
        OkFvCardModule,
        OkFvChipSelectorModule,
        OkFvContextHelpModule,
        OkFvSearchInputModule,
        OkFvSplitButtonModule,
        OkFvSplitButtonAnchorModule,
        OkFvSummaryPanelModule,
        OkFvSummaryPanelTileModule,
        SubContainerModule
    ],
    exports: [FvSectionComponent]
})
export class FvSectionModule { }
