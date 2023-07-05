import { attr } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { SpinnerAppearance, SpinnerAppearancePattern } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-spinner': Spinner;
    }
}

/**
 * A Nimble-styled spinner component.
 * A spinner is an animating indicator that can be placed in a particular region of a page to represent loading progress, or an ongoing operation, of an indeterminate / unknown duration.
 */
export class Spinner extends FoundationElement implements SpinnerAppearancePattern {
    /**
     * @public
     * @description
     * Type of spinner
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
export const spinnerTag = DesignSystem.tagFor(Spinner);
