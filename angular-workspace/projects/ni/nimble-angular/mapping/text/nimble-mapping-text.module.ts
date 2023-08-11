import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleMappingTextDirective } from './nimble-mapping-text.directive';

import '@ni/nimble-components/dist/esm/mapping/text';

@NgModule({
    declarations: [NimbleMappingTextDirective],
    imports: [CommonModule],
    exports: [NimbleMappingTextDirective]
})
export class NimbleMappingTextModule { }
