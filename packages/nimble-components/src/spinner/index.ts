import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { UserDismissed } from '../patterns/dialog/types';
import { styles } from './styles';
import { template } from './template';
import type { SpinnerThemeVariant, SpinnerSize } from './types';

export { UserDismissed };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-spinner': Spinner;
    }
}

/**
 * Spinner
 */
export class Spinner extends FoundationElement {
    /**
     * @public
     * @remarks
     * HTML Attribute: size
     */
    @attr
    public size: SpinnerSize | undefined;

    /**
     * @public
     * @remarks
     * HTML Attribute: appearance-variant
     */
    @attr({ attribute: 'appearance-variant' })
    public appearanceVariant: SpinnerThemeVariant;

    @attr({ attribute: 'reduced-motion-variant' })
    public reducedMotionVariant = 'fade';
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Spinner extends ARIAGlobalStatesAndProperties {}
applyMixins(Spinner, ARIAGlobalStatesAndProperties);

const nimbleSpinner = Spinner.compose({
    baseName: 'spinner',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSpinner());
