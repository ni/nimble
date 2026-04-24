import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { FvAccordionItemAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-accordion-item': FvAccordionItem;
    }
}

/**
 * An accordion item component that can be expanded or collapsed to
 * show or hide its content.
 */
export class FvAccordionItem extends FoundationElement {
    @attr
    public header = '';

    @attr({ mode: 'boolean' })
    public expanded = false;

    @attr()
    public appearance: FvAccordionItemAppearance = FvAccordionItemAppearance.ghost;

    public handleToggle(event: Event): boolean {
        this.expanded = (event.target as HTMLDetailsElement).open;
        return true;
    }
}

const okFvAccordionItem = FvAccordionItem.compose({
    baseName: 'fv-accordion-item',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('ok')
    .register(okFvAccordionItem());
export const fvAccordionItemTag = 'ok-fv-accordion-item';
