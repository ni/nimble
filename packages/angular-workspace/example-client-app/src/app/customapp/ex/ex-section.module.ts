import { NgModule } from '@angular/core';
import { OkExButtonModule } from '@ni/ok-angular/ex/button';
import { ExButtonSectionComponent } from './ex-button-section.component';
import { ExSectionComponent } from './ex-section.component';
import { SubContainerModule } from '../sub-container/sub-container.module';

@NgModule({
    declarations: [ExSectionComponent, ExButtonSectionComponent],
    imports: [OkExButtonModule, SubContainerModule],
    exports: [ExSectionComponent]
})
export class ExSectionModule { }
