import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnEnumMentionDirective } from './nimble-table-column-enum-text.directive';

import '@ni/nimble-components/dist/esm/table-column/text';

@NgModule({
    declarations: [NimbleTableColumnEnumMentionDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnEnumMentionDirective]
})
export class NimbleTableColumnEnumMentionModule { }
