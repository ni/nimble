import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleBannerDirective } from './nimble-banner.directive';

import '@ni/nimble-components/dist/esm/banner';

@NgModule({
    declarations: [NimbleBannerDirective],
    imports: [CommonModule],
    exports: [NimbleBannerDirective]
})
export class NimbleBannerModule { }
