import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkExButtonDirective } from './ok-ex-button.directive';

import '@ni/ok-components/dist/esm/ex/button';

@NgModule({
    declarations: [OkExButtonDirective],
    imports: [CommonModule],
    exports: [OkExButtonDirective]
})
export class OkExButtonModule { }
