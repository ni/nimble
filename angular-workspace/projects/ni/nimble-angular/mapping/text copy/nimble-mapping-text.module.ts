import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleMappingMentionDirective } from './nimble-mapping-text.directive';

import '@ni/nimble-components/dist/esm/mapping/mention';

@NgModule({
    declarations: [NimbleMappingMentionDirective],
    imports: [CommonModule],
    exports: [NimbleMappingMentionDirective]
})
export class NimbleMappingMentionModule { }
