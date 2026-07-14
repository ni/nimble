import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkFvMasterDetailListDirective } from './ok-fv-master-detail-list.directive';

import '@ni/ok-components/dist/esm/fv/master-detail-list';

@NgModule({
    declarations: [OkFvMasterDetailListDirective],
    imports: [CommonModule],
    exports: [OkFvMasterDetailListDirective]
})
export class OkFvMasterDetailListModule { }