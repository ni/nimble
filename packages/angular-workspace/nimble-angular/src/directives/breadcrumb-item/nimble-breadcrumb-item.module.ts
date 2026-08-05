import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleBreadcrumbItemDirective } from './nimble-breadcrumb-item.directive';
import { NimbleRouterLinkDirective } from '../routerLink/nimbleRouterLink.directive';

import '@ni/nimble-components/dist/esm/breadcrumb-item';

@NgModule({
    declarations: [NimbleBreadcrumbItemDirective],
    imports: [CommonModule, NimbleRouterLinkDirective],
    exports: [NimbleBreadcrumbItemDirective, NimbleRouterLinkDirective]
})
export class NimbleBreadcrumbItemModule { }
