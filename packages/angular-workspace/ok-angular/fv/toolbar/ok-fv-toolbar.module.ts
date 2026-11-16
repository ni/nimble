import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvToolbarDirective } from './ok-fv-toolbar.directive';

import '@ni/ok-components/dist/esm/fv/toolbar';

@NgModule({
    declarations: [OkFvToolbarDirective],
    imports: [CommonModule],
    exports: [OkFvToolbarDirective]
})
export class OkFvToolbarModule { }
