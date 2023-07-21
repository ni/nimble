import {
    DesignSystem,
    AccordionItem as FoundationAccordionItem,
    accordionItemTemplate as template,
    AccordionItemOptions
} from '@microsoft/fast-foundation';
import { arrowDown16X16, arrowExpanderRight16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-accordion-item': FoundationAccordionItem;
    }
}
/**
 * A nimble-styled accordion item
 */

export class AccordionItem extends FoundationAccordionItem {}

const nimbleAccordionItem = AccordionItem.compose<AccordionItemOptions>({
    baseName: 'accordion-item',
    baseClass: FoundationAccordionItem,
    template,
    styles,
    expandedIcon: arrowDown16X16.data,
    collapsedIcon: arrowExpanderRight16X16.data
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAccordionItem());
export const accordionItemTag = DesignSystem.tagFor(AccordionItem);