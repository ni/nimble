import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkFvSummaryPanelTileDirective } from './ok-fv-summary-panel-tile.directive';

import '@ni/ok-components/dist/esm/fv/summary-panel-tile';

@NgModule({
    declarations: [OkFvSummaryPanelTileDirective],
    imports: [CommonModule],
    exports: [OkFvSummaryPanelTileDirective]
})
export class OkFvSummaryPanelTileModule { }
