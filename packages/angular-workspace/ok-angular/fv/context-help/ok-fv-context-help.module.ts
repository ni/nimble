import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkFvContextHelpDirective } from './ok-fv-context-help.directive';

import '@ni/ok-components/dist/esm/fv/context-help';

@NgModule({
    declarations: [OkFvContextHelpDirective],
    imports: [CommonModule],
    exports: [OkFvContextHelpDirective]
})
export class OkFvContextHelpModule { }
