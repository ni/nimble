import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { SpinnerSize } from './types';

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
     * The size of the spinner (preset size options chosen by designers).
     * If unset, the spinner will scale based on its width/height styles,
     * or will be size 32x32 if not specified.
     *
     * @public
     * @remarks
     * HTML Attribute: size
     */
    @attr
    public size: SpinnerSize;
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
