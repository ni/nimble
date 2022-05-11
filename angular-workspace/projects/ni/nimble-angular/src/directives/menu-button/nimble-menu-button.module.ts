import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleMenuButtonDirective } from './nimble-menu-button.directive';

import '@ni/nimble-components/dist/esm/menu-button';
import '@ni/nimble-components/dist/esm/toggle-button';
import '@ni/nimble-components/dist/esm/anchored-region';

@NgModule({
    declarations: [NimbleMenuButtonDirective],
    imports: [CommonModule],
    exports: [NimbleMenuButtonDirective]
})
export class NimbleMenuButtonModule { }
