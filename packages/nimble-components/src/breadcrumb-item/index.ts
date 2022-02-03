import { html } from '@microsoft/fast-element';
import {
    DesignSystem,
    BreadcrumbItem as FoundationBreadcrumbItem,
    breadcrumbItemTemplate as template,
    BreadcrumbItemOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { ArrowExpanderRightIcon } from '../icons/arrow-expander';

export type { BreadcrumbItem };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-breadcrumb-item': BreadcrumbItem;
    }
}

/**
 * A nimble-styled breadcrumb
 */
class BreadcrumbItem extends FoundationBreadcrumbItem {}

const nimbleBreadcrumbItem = BreadcrumbItem.compose<BreadcrumbItemOptions>({
    baseName: 'breadcrumb-item',
    baseClass: FoundationBreadcrumbItem,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles,
    separator: html`<nimble-arrow-expander-right-icon></nimble-arrow-expander-right-icon>`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleBreadcrumbItem());
