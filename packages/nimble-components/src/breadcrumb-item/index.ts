import {
    DesignSystem,
    BreadcrumbItem as FoundationBreadcrumbItem,
    breadcrumbItemTemplate as template,
    BreadcrumbItemOptions
} from '@microsoft/fast-foundation';
import { controlsArrowExpanderRight16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

export type { BreadcrumbItem };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-breadcrumb-item': BreadcrumbItem;
    }
}

/**
 * A nimble-styled breadcrumb item
 */
class BreadcrumbItem extends FoundationBreadcrumbItem {}

const nimbleBreadcrumbItem = BreadcrumbItem.compose<BreadcrumbItemOptions>({
    baseName: 'breadcrumb-item',
    baseClass: FoundationBreadcrumbItem,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles,
    separator: controlsArrowExpanderRight16X16.data
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleBreadcrumbItem());
