import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { SpinnerSize } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-spinner': Spinner;
    }
}

/**
 * A Nimble-styled spinner component.
 * A spinner is an animating indicator that can be placed in a particular region of a page to represent loading progress, or an ongoing operation, of an indeterminate / unknown duration.
 */
export class Spinner extends FoundationElement {
    /**
     * Spinner size, defaults to 16x16.
     * Can also be overridden via CSS width ahd height for custom sizes.
     *
     * @public
     * @remarks
     * HTML Attribute: size
     */
    @attr
    public size: SpinnerSize;
}

const nimbleSpinner = Spinner.compose({
    baseName: 'spinner',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSpinner());
