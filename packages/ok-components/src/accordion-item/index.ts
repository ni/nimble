import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import '@ni/nimble-components/dist/esm/icons/arrow-expander-right';
import { styles } from './styles';
import { template } from './template';
import { AccordionItemAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-accordion-item': AccordionItem;
    }
}

/**
 * An accordion item component that can be expanded or collapsed to
 * show or hide its content.
 */
export class AccordionItem extends FoundationElement {
    @attr
    public header = '';

    @attr({ mode: 'boolean' })
    public expanded = false;

    @attr()
    public appearance: AccordionItemAppearance = AccordionItemAppearance.ghost;

    public handleToggle(event: Event): boolean {
        this.expanded = (event.target as HTMLDetailsElement).open;
        return true;
    }
}

const okAccordionItem = AccordionItem.compose({
    baseName: 'accordion-item',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('ok')
    .register(okAccordionItem());
export const accordionItemTag = 'ok-accordion-item';
