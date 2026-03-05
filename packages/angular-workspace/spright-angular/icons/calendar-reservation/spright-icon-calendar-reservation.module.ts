import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightIconCalendarReservationDirective } from './spright-icon-calendar-reservation.directive';

import '@ni/spright-components/dist/esm/icons/calendar-reservation';

@NgModule({
    declarations: [SprightIconCalendarReservationDirective],
    imports: [CommonModule],
    exports: [SprightIconCalendarReservationDirective]
})
export class SprightIconCalendarReservationModule { }
