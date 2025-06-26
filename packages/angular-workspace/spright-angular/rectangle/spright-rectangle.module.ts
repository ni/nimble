import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightRectangleDirective } from './spright-rectangle.directive';

import '@ni/spright-components/dist/esm/rectangle';

@NgModule({
    declarations: [SprightRectangleDirective],
    imports: [CommonModule],
    exports: [SprightRectangleDirective]
})
export class SprightRectangleModule { }
