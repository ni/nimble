import { attr, observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    Accordion as FoundationAccordion,
    AccordionExpandMode
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { AccordionAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-accordion': Accordion;
    }
}

/**
 * A nimble-styled accordion
 */
export class Accordion extends FoundationAccordion {
    @attr
    public appearance: AccordionAppearance = AccordionAppearance.outline;

    @observable
    public override accordionItems!: HTMLElement[];

    public expandmodeChanged(): void {
        this.expandmode = AccordionExpandMode.multi;
    }

    public override accordionItemsChanged(): void {
        this.accordionItems.forEach((appearance: HTMLElement) => {
            appearance.setAttribute('appearance', this.appearance);
        });
    }

    public appearanceChanged(_oldValue: string, _newValue: string): void {
        if (this.$fastController.isConnected) {
            this.setAccordionItemAppearance();
        }
    }

    private readonly setAccordionItemAppearance = (): void => {
        this.accordionItems.forEach((appearance: HTMLElement) => {
            appearance.setAttribute('appearance', this.appearance);
        });
    };
}

const nimbleAccordion = Accordion.compose({
    baseName: 'accordion',
    baseClass: FoundationAccordion,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAccordion());
export const accordionTag = DesignSystem.tagFor(Accordion);
