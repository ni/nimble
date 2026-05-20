import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkFvSummaryPanelDirective } from './ok-fv-summary-panel.directive';

import '@ni/ok-components/dist/esm/fv/summary-panel';

@NgModule({
    declarations: [OkFvSummaryPanelDirective],
    imports: [CommonModule],
    exports: [OkFvSummaryPanelDirective]
})
export class OkFvSummaryPanelModule { }
