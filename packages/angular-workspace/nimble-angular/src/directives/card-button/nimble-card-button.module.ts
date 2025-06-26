import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleCardButtonDirective } from './nimble-card-button.directive';

import '@ni/nimble-components/dist/esm/card-button';

@NgModule({
    declarations: [NimbleCardButtonDirective],
    imports: [CommonModule],
    exports: [NimbleCardButtonDirective]
})
export class NimbleCardButtonModule { }
