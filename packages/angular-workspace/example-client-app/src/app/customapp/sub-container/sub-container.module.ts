import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubContainerComponent } from './sub-container.component';

@NgModule({
    declarations: [SubContainerComponent],
    imports: [CommonModule],
    exports: [SubContainerComponent]
})
export class SubContainerModule {}
