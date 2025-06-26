import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleMenuButtonDirective } from './nimble-menu-button.directive';

import '@ni/nimble-components/dist/esm/menu-button';

@NgModule({
    declarations: [NimbleMenuButtonDirective],
    imports: [CommonModule],
    exports: [NimbleMenuButtonDirective]
})
export class NimbleMenuButtonModule { }
