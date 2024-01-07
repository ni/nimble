import {
    DesignSystem,
    BreadcrumbItem as FoundationBreadcrumbItem,
    breadcrumbItemTemplate as template,
    BreadcrumbItemOptions
} from '@microsoft/fast-foundation';
import { forwardSlash16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';

const baseName = 'breadcrumb-item';
export const breadcrumbItemTag = `nimble-${baseName}`;
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
    baseName,
    baseClass: FoundationBreadcrumbItem,
    template,
    styles,
    separator: forwardSlash16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleBreadcrumbItem());
