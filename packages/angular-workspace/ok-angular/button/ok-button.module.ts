import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkButtonDirective } from './ok-button.directive';

import '@ni/ok-components/dist/esm/button';

@NgModule({
    declarations: [OkButtonDirective],
    imports: [CommonModule],
    exports: [OkButtonDirective]
})
export class OkButtonModule { }
