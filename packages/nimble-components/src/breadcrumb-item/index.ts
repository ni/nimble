import { attr, html } from '@microsoft/fast-element';
import {
    DesignSystem,
    BreadcrumbItem as FoundationBreadcrumbItem,
    breadcrumbItemTemplate as template,
    BreadcrumbItemOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { ArrowExpanderRightIcon } from '../icons/arrow-expander-right';
import { BreadcrumbItemAppearance } from './types';

export type { BreadcrumbItem };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-breadcrumb-item': BreadcrumbItem;
    }
}

/**
 * A nimble-styled breadcrumb item
 */
class BreadcrumbItem extends FoundationBreadcrumbItem {
    /**
     * The appearance the button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance!: BreadcrumbItemAppearance;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = BreadcrumbItemAppearance.Hypertext;
        }
    }
}

const arrowExpanderRightIconTag = DesignSystem.tagFor(ArrowExpanderRightIcon);

const nimbleBreadcrumbItem = BreadcrumbItem.compose<BreadcrumbItemOptions>({
    baseName: 'breadcrumb-item',
    baseClass: FoundationBreadcrumbItem,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles,
    separator: html`<${arrowExpanderRightIconTag}></${arrowExpanderRightIconTag}>`
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleBreadcrumbItem());
