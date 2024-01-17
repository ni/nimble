import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DurationPipe } from './duration.pipe';
import { FormatDecimalPipe } from './format-decimal.pipe';

@NgModule({
    declarations: [DurationPipe, FormatDecimalPipe],
    imports: [CommonModule],
    exports: [DurationPipe, FormatDecimalPipe]
})
export class NimblePipesModule { }
