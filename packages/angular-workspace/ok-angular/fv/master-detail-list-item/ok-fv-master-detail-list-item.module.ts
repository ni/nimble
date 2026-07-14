import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkFvMasterDetailListItemDirective } from './ok-fv-master-detail-list-item.directive';

import '@ni/ok-components/dist/esm/fv/master-detail-list-item';

@NgModule({
    declarations: [OkFvMasterDetailListItemDirective],
    imports: [CommonModule],
    exports: [OkFvMasterDetailListItemDirective]
})
export class OkFvMasterDetailListItemModule { }