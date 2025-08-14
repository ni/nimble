import { attr, observable } from '@ni/fast-element';
import {
    applyMixins,
    DesignSystem,
    FoundationElement,
    StartEnd
} from '@ni/fast-foundation';
import { uniqueId } from '@ni/fast-web-utilities';
import { template } from './template';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-accordion-item': AccordionItem;
    }
}

/** Nimble Accordion Item */
export class AccordionItem extends FoundationElement {
    /** @internal */
    @observable public headerControl!: HTMLButtonElement;
    /** @internal */
    @observable public region!: HTMLDivElement;

    /** Heading text if no slot provided */
    @attr public heading?: string;
    /** Expanded state */
    @attr({ mode: 'boolean' }) public expanded = false;
    /** Disabled state */
    @attr({ mode: 'boolean' }) public disabled = false;
    /** Error surfaced from child content; used to style the header */
    @attr({ attribute: 'error-visible', mode: 'boolean' }) public errorVisible = false;

    /** @internal */
    public contentSlot?: HTMLSlotElement;
    private mutationObserver?: MutationObserver;
    private readonly headerId: string = uniqueId('accordion-header-');
    private readonly regionId: string = uniqueId('accordion-region-');

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        queueMicrotask(() => this.setupObservers());
    }

    /** @internal */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.mutationObserver?.disconnect();
    }

    /** @internal */
    public handleHeaderClick(): void {
        if (this.disabled) {
            return;
        }
        this.dispatchEvent(
            new CustomEvent('toggle-request', {
                bubbles: true,
                composed: true,
                detail: { item: this }
            })
        );
    }

    /** @internal */
    public handleKeydown(e: KeyboardEvent): void {
        if (this.disabled) {
            return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleHeaderClick();
        }
    }

    private setupObservers(): void {
        const slot = this.shadowRoot?.querySelector(
            'slot:not([name])'
        ) as HTMLSlotElement | null;
        this.contentSlot = slot ?? undefined;
        slot?.addEventListener('slotchange', () => this.evaluateChildErrors());
        this.mutationObserver = new MutationObserver(() => this.evaluateChildErrors());
        this.mutationObserver.observe(this, {
            subtree: true,
            attributes: true,
            attributeFilter: [
                'error-visible',
                'aria-invalid',
                'aria-errormessage'
            ]
        });
        this.evaluateChildErrors();
    }

    private evaluateChildErrors(): void {
        const hasError = !!this.querySelector(
            '[error-visible], [aria-invalid="true"], [aria-errormessage]'
        );
        this.errorVisible = hasError;
    }

    /** @internal */
    public get headerAriaExpanded(): 'true' | 'false' {
        return this.expanded ? 'true' : 'false';
    }

    /** @internal */
    public get headerAriaControls(): string {
        return this.regionId;
    }

    /** @internal */
    public get regionAriaLabelledby(): string {
        return this.headerId;
    }

    /** @internal */
    public get headerElementId(): string {
        return this.headerId;
    }

    /** @internal */
    public get regionElementId(): string {
        return this.regionId;
    }
}

const nimbleAccordionItem = AccordionItem.compose({
    baseName: 'accordion-item',
    template,
    styles,
    shadowOptions: { delegatesFocus: true }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAccordionItem());
export const accordionItemTag = 'nimble-accordion-item';

applyMixins(AccordionItem, StartEnd);
