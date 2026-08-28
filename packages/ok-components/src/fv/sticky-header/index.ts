import { observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-sticky-header': FvStickyHeader;
    }
}

/**
 * Displays an alternate header in a sticky overlay after the primary header leaves the viewport.
 */
export class FvStickyHeader extends FoundationElement {
    /** @internal */
    @observable
    public hasHeader = false;

    /** @internal */
    @observable
    public hasStickyHeader = false;

    /** @internal */
    @observable
    public headerIsVisible = true;

    /** @internal */
    @observable
    public showStickyHeader = false;

    /** @internal */
    public readonly headerSlot!: HTMLSlotElement;

    /** @internal */
    public readonly stickyHeaderSlot!: HTMLSlotElement;

    private readonly headerVisibility = new Map<Element, boolean>();
    private readonly headerIntersectionObserver = new IntersectionObserver(entries => {
        this.handleHeaderIntersection(entries);
    });

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateStickyHeaderContent();
        this.observeHeader();
    }

    /** @internal */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.headerIntersectionObserver.disconnect();
    }

    /** @internal */
    public handleHeaderSlotChange(): void {
        this.observeHeader();
    }

    /** @internal */
    public handleStickyHeaderSlotChange(event: Event): void {
        this.hasStickyHeader = (event.target as HTMLSlotElement).assignedElements({ flatten: true }).length > 0;
        this.updateStickyHeaderContent();
    }

    /** @internal */
    public handleHeaderIntersection(entries: IntersectionObserverEntry[]): void {
        entries.forEach(entry => this.headerVisibility.set(entry.target, entry.isIntersecting));
        this.headerIsVisible = Array.from(this.headerVisibility.values()).some(Boolean);
        this.updateStickyHeaderContent();
    }

    private observeHeader(): void {
        this.headerIntersectionObserver.disconnect();
        const headerElements = this.headerSlot.assignedElements({ flatten: true });
        this.hasHeader = headerElements.length > 0;
        this.headerIsVisible = true;
        this.headerVisibility.clear();
        headerElements.forEach(element => {
            this.headerVisibility.set(element, true);
            this.headerIntersectionObserver.observe(element);
        });
        this.updateStickyHeaderContent();
    }

    private updateStickyHeaderContent(): void {
        this.hasStickyHeader = this.stickyHeaderSlot.assignedElements({ flatten: true }).length > 0;
        this.showStickyHeader = this.hasHeader && this.hasStickyHeader && !this.headerIsVisible;
    }
}

const okFvStickyHeader = FvStickyHeader.compose({
    baseName: 'fv-sticky-header',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvStickyHeader());
export const fvStickyHeaderTag = 'ok-fv-sticky-header';
