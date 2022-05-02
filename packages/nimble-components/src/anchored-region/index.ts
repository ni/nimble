import {
    DesignSystem,
    AnchoredRegion as FoundationAnchoredRegion,
    anchoredRegionTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchored-region': AnchoredRegion;
    }
}

/**
 * A nimble-styled anchored region control.
 */
export class AnchoredRegion extends FoundationAnchoredRegion {}

const nimbleAnchoredRegion = AnchoredRegion.compose({
    baseName: 'anchored-region',
    baseClass: FoundationAnchoredRegion,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAnchoredRegion());
