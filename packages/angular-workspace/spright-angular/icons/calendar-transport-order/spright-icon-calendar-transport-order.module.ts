import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightIconCalendarTransportOrderDirective } from './spright-icon-calendar-transport-order.directive';

import '@ni/spright-components/dist/esm/icons/calendar-transport-order';

@NgModule({
    declarations: [SprightIconCalendarTransportOrderDirective],
    imports: [CommonModule],
    exports: [SprightIconCalendarTransportOrderDirective]
})
export class SprightIconCalendarTransportOrderModule { }
