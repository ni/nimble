import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvBulkEditFieldDirective } from './ok-fv-bulk-edit-field.directive';

import '@ni/ok-components/dist/esm/fv/bulk-edit-field';

@NgModule({
    declarations: [OkFvBulkEditFieldDirective],
    imports: [CommonModule],
    exports: [OkFvBulkEditFieldDirective]
})
export class OkFvBulkEditFieldModule {}
