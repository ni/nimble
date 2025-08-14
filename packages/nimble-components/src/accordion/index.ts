import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { template as accordionTemplate } from './template.js';
import { styles as accordionStyles } from './styles.js';
import type { AccordionItem } from './item';
import './item';

export type AccordionExpandMode = 'single' | 'multiple';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-accordion': Accordion;
        'nimble-accordion-item': AccordionItem;
    }
}

/**
 * Nimble Accordion container
 */
export class Accordion extends FoundationElement {
    /** Controls whether one or multiple panels can be open. Defaults to "multiple". */
    @attr({ attribute: 'expand-mode' })
    public expandMode: AccordionExpandMode = 'multiple';

    /** @internal */
    @observable public slottedItems: AccordionItem[] = [];
    /** @internal */
    public defaultSlot?: HTMLSlotElement;

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        queueMicrotask(() => this.setupSlotListener());
        this.addEventListener(
            'toggle-request',
            this.onToggleRequest as EventListener
        );
        this.addEventListener('keydown', this.onKeydown as EventListener);
    }

    /** @internal */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener(
            'toggle-request',
            this.onToggleRequest as EventListener
        );
        this.removeEventListener('keydown', this.onKeydown as EventListener);
    }

    private setupSlotListener(): void {
        const slot = this.shadowRoot?.querySelector(
            'slot:not([name])'
        ) as HTMLSlotElement | null;
        if (!slot) {
            return;
        }
        this.defaultSlot = slot;
        const sync = (): void => this.syncItems();
        slot.addEventListener('slotchange', sync);
        sync();
    }

    private syncItems(): void {
        const assigned = this.defaultSlot?.assignedElements({ flatten: true }) || [];
        const items = assigned.filter(
            (el): el is AccordionItem => el.tagName === 'NIMBLE-ACCORDION-ITEM'
        );
        this.slottedItems = items;
        this.updateRovingTabIndex();
        if (this.expandMode === 'single') {
            this.collapseAllButFirstExpanded();
        }
    }

    private readonly onToggleRequest = (
        e: CustomEvent<{ item: AccordionItem }>
    ): void => {
        const { item } = e.detail;
        if (this.expandMode === 'single') {
            this.slottedItems.forEach(i => {
                if (i !== item) {
                    i.expanded = false;
                }
            });
        }
        item.expanded = !item.expanded;
        this.updateRovingTabIndex();
    };

    private readonly onKeydown = (e: KeyboardEvent): void => {
        const headers = this.getHeaderControls();
        if (headers.length === 0) {
            return;
        }
        const activeEl = document.activeElement;
        const currentIndex = headers.indexOf(
            activeEl instanceof HTMLButtonElement
                ? activeEl
                : (null as unknown as HTMLButtonElement)
        );
        switch (e.key) {
            case 'ArrowDown':
            case 'Down': {
                const next = headers[(Math.max(0, currentIndex) + 1) % headers.length];
                next?.focus();
                e.preventDefault();
                break;
            }
            case 'ArrowUp':
            case 'Up': {
                const prev = headers[
                    (currentIndex - 1 + headers.length) % headers.length
                ];
                prev?.focus();
                e.preventDefault();
                break;
            }
            case 'Home': {
                headers[0]?.focus();
                e.preventDefault();
                break;
            }
            case 'End': {
                headers[headers.length - 1]?.focus();
                e.preventDefault();
                break;
            }
            default:
                break;
        }
    };

    private getHeaderControls(): HTMLButtonElement[] {
        return this.slottedItems
            .map(i => i.headerControl)
            .filter(
                (el): el is HTMLButtonElement => el instanceof HTMLButtonElement && !el.disabled
            );
    }

    private collapseAllButFirstExpanded(): void {
        let found = false;
        for (const item of this.slottedItems) {
            if (item.expanded && !found) {
                found = true;
            } else {
                item.expanded = false;
            }
        }
    }

    private updateRovingTabIndex(): void {
        const headers = this.getHeaderControls();
        const firstExpanded = this.slottedItems.find(
            i => i.expanded && !i.disabled
        )?.headerControl;
        const focusTarget = firstExpanded || headers.find(h => !h.disabled);
        headers.forEach(h => h.setAttribute('tabindex', h === focusTarget ? '0' : '-1'));
    }
}

const nimbleAccordion = Accordion.compose({
    baseName: 'accordion',
    template: accordionTemplate,
    styles: accordionStyles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAccordion());
export const accordionTag = 'nimble-accordion';
