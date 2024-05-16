import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleBreadcrumbItemDirective } from './nimble-breadcrumb-item.directive';
import { NimbleBreadcrumbItemRouterLinkDirective } from './nimble-breadcrumb-item-router-link.directive';
import { NimbleBreadcrumbItemRouterLinkWithHrefDirective } from './nimble-breadcrumb-item-router-link-with-href.directive';

import '@ni/nimble-components/dist/esm/breadcrumb-item';

@NgModule({
    declarations: [NimbleBreadcrumbItemDirective, NimbleBreadcrumbItemRouterLinkDirective, NimbleBreadcrumbItemRouterLinkWithHrefDirective],
    imports: [CommonModule],
    exports: [NimbleBreadcrumbItemDirective, NimbleBreadcrumbItemRouterLinkDirective, NimbleBreadcrumbItemRouterLinkWithHrefDirective]
})
export class NimbleBreadcrumbItemModule { }
