import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'aight-aight-aight': AightAight;
    }
}

/**
 * A Spright demo component (not for production use)
 */
export class AightAight extends FoundationElement {}

const aightAightAight = AightAight.compose({
    baseName: 'aight-aight',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('aight').register(aightAightAight());
export const aightAightTag = 'aight-aight-aight';
