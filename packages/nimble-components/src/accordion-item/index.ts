import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    AccordionItem as FoundationAccordionItem,
    AccordionItemOptions
} from '@microsoft/fast-foundation';
import { arrowExpanderDown16X16, arrowExpanderRight16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { AccordionAppearance } from './types';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-accordion-item': FoundationAccordionItem;
    }
}

/**
 * A nimble-styled accordion item
 */
export class AccordionItem extends FoundationAccordionItem {
    @attr
    public appearance: AccordionAppearance = AccordionAppearance.outline;

    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;

    @attr({ mode: 'boolean' })
    public open = false;

    @attr({ mode: 'boolean' })
    public override expanded = false;

    /**
     * @internal
     */
    public override clickHandler = (_e: MouseEvent): void => {
        this.open = !this.open;
        this.expanded = !this.expanded;
    };
}

const nimbleAccordionItem = AccordionItem.compose<AccordionItemOptions>({
    baseName: 'accordion-item',
    baseClass: FoundationAccordionItem,
    template,
    styles,
    expandedIcon: arrowExpanderDown16X16.data,
    collapsedIcon: arrowExpanderRight16X16.data
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAccordionItem());
export const accordionItemTag = DesignSystem.tagFor(AccordionItem);