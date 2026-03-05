import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightIconCalendarTestPlanDirective } from './spright-icon-calendar-test-plan.directive';

import '@ni/spright-components/dist/esm/icons/calendar-test-plan';

@NgModule({
    declarations: [SprightIconCalendarTestPlanDirective],
    imports: [CommonModule],
    exports: [SprightIconCalendarTestPlanDirective]
})
export class SprightIconCalendarTestPlanModule { }
