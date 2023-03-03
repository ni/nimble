import {
    DesignSystem,
    BreadcrumbItem as FoundationBreadcrumbItem,
    breadcrumbItemTemplate as template,
    BreadcrumbItemOptions
} from '@microsoft/fast-foundation';
import { forwardSlash16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-breadcrumb-item': BreadcrumbItem;
    }
}

/**
 * A nimble-styled breadcrumb item
 */
export class BreadcrumbItem extends FoundationBreadcrumbItem {}

const nimbleBreadcrumbItem = BreadcrumbItem.compose<BreadcrumbItemOptions>({
    baseName: 'breadcrumb-item',
    baseClass: FoundationBreadcrumbItem,
    template,
    styles,
    separator: forwardSlash16X16.data
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleBreadcrumbItem());
export const breadcrumbItemTag = DesignSystem.tagFor(BreadcrumbItem);
