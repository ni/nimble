import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleButtonDirective } from './nimble-button-directive';

@NgModule({
    declarations: [NimbleButtonDirective],
    imports: [CommonModule],
    exports: [NimbleButtonDirective]
})
export class NimbleButtonModule { }
