import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleBreadcrumbItemDirective } from './nimble-breadcrumb-item.directive';
import { NimbleBreadcrumbItemRouterLinkWithHrefDirective } from './nimble-breadcrumb-item-router-link-with-href.directive';

import '@ni/nimble-components/dist/esm/breadcrumb-item';

@NgModule({
    declarations: [NimbleBreadcrumbItemDirective, NimbleBreadcrumbItemRouterLinkWithHrefDirective],
    imports: [CommonModule],
    exports: [NimbleBreadcrumbItemDirective, NimbleBreadcrumbItemRouterLinkWithHrefDirective]
})
export class NimbleBreadcrumbItemModule { }
