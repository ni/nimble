import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTabDirective } from './nimble-tab.directive';

import '@ni/nimble-components/dist/esm/tab';

@NgModule({
    declarations: [NimbleTabDirective],
    imports: [CommonModule],
    exports: [NimbleTabDirective]
})
export class NimbleTabModule { }
