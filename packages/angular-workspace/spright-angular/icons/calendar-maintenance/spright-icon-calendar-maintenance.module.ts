import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightIconCalendarMaintenanceDirective } from './spright-icon-calendar-maintenance.directive';

import '@ni/spright-components/dist/esm/icons/calendar-maintenance';

@NgModule({
    declarations: [SprightIconCalendarMaintenanceDirective],
    imports: [CommonModule],
    exports: [SprightIconCalendarMaintenanceDirective]
})
export class SprightIconCalendarMaintenanceModule { }
