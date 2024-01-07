import {
    DesignSystem,
    BreadcrumbItem as FoundationBreadcrumbItem,
    breadcrumbItemTemplate as template,
    BreadcrumbItemOptions
} from '@microsoft/fast-foundation';
import { forwardSlash16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';

export const breadcrumbItemTag = 'nimble-breadcrumb-item';
declare global {
    interface HTMLElementTagNameMap {
        [breadcrumbItemTag]: BreadcrumbItem;
    }
}

/**
 * A nimble-styled breadcrumb item
 */
export class BreadcrumbItem extends FoundationBreadcrumbItem {}

const nimbleBreadcrumbItem = BreadcrumbItem.compose<BreadcrumbItemOptions>({
    baseName: breadcrumbItemTag,
    baseClass: FoundationBreadcrumbItem,
    template,
    styles,
    separator: forwardSlash16X16.data
});

DesignSystem.getOrCreate().register(nimbleBreadcrumbItem());
