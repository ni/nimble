import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkFvCardDirective } from './ok-fv-card.directive';

import '@ni/ok-components/dist/esm/fv/card';

@NgModule({
    declarations: [OkFvCardDirective],
    imports: [CommonModule],
    exports: [OkFvCardDirective]
})
export class OkFvCardModule { }
