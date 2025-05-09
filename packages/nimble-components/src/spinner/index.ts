import { attr } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { SpinnerAppearance } from './types';

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
     * @public
     * @description
     * The appearance the spinner area should have.
     */
    @attr
    public appearance: SpinnerAppearance = SpinnerAppearance.default;
}

const nimbleSpinner = Spinner.compose({
    baseName: 'spinner',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSpinner());
export const spinnerTag = 'nimble-spinner';
