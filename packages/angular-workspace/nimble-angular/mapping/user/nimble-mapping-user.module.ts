import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleMappingUserDirective } from './nimble-mapping-user.directive';

import '@ni/nimble-components/dist/esm/mapping/user';

@NgModule({
    declarations: [NimbleMappingUserDirective],
    imports: [CommonModule],
    exports: [NimbleMappingUserDirective]
})
export class NimbleMappingUserModule { }
