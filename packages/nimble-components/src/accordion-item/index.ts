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

    public firstUpdated(): void {
        const details: HTMLElement = document.querySelector('#accordion-1')!;
        const observer = new MutationObserver(changes => {
            for (const change of changes) {
                if (change.type === 'attributes' && change.attributeName === 'expanded') {
                    if (this.expanded) {
                        this.open = true;
                    } else {
                        this.open = false;
                    }
                }
            }
        });
        observer.observe(details, { attributes: true });
    }
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