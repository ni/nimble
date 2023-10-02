import {
    DesignSystem,
    AnchoredRegion as FoundationAnchoredRegion,
    anchoredRegionTemplate as template
} from '@microsoft/fast-foundation';
import { Notifier, Observable } from '@microsoft/fast-element';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchored-region': AnchoredRegion;
    }
}

// When the anchor element changes position on the page, it is the client's responsibility to update the position
// of the anchored region by calling update() on the anchored region.
//
// When the anchor element is recreated on the page, it is the client's responsibility to reset the reference the
// anchored region has to the anchor element. This can be done by either recreating the anchor element with a new
// ID that is also set as the \`anchor\` attribute on the anchored region or by explicitly setting the value of
// anchorElement on the anchored region to the new anchor element.

/**
 * A nimble-styled anchored region control.
 */
export class AnchoredRegion extends FoundationAnchoredRegion {
    private anchorElementNotifier?: Notifier;
    private anchorElementIntersectionObserver?: IntersectionObserver;

    public override connectedCallback(): void {
        super.connectedCallback();

        this.anchorElementNotifier = Observable.getNotifier(this);
        this.anchorElementNotifier.subscribe(this, 'anchorElement');
        this.addAnchorElementIntersectionObserver();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();

        this.anchorElementNotifier?.unsubscribe(this);
        this.anchorElementNotifier = undefined;
        this.removeAnchorElementIntersectionObserver();
    }

    public handleChange(source: unknown, args: unknown): void {
        if (!(source instanceof AnchoredRegion && args === 'anchorElement')) {
            return;
        }

        this.addAnchorElementIntersectionObserver();
    }

    private addAnchorElementIntersectionObserver(): void {
        if (this.anchorElementIntersectionObserver) {
            this.removeAnchorElementIntersectionObserver();
        }

        if (!this.anchorElement) {
            return;
        }

        this.anchorElementIntersectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        this.$emit('target-out-of-view');
                    }
                });
            },
            {
                threshold: 0
            }
        );
        this.anchorElementIntersectionObserver.observe(this.anchorElement);
    }

    private removeAnchorElementIntersectionObserver(): void {
        this.anchorElementIntersectionObserver?.disconnect();
        this.anchorElementIntersectionObserver = undefined;
    }
}

const nimbleAnchoredRegion = AnchoredRegion.compose({
    baseName: 'anchored-region',
    baseClass: FoundationAnchoredRegion,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAnchoredRegion());
export const anchoredRegionTag = DesignSystem.tagFor(AnchoredRegion);
