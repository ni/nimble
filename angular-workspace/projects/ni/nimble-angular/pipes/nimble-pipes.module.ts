import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DurationPipe } from './duration.pipe';
import { FormatBytesSizePipe } from './format-bytes-size.pipe';

@NgModule({
    declarations: [DurationPipe, FormatBytesSizePipe],
    imports: [CommonModule],
    exports: [DurationPipe, FormatBytesSizePipe]
})
export class NimblePipesModule { }
