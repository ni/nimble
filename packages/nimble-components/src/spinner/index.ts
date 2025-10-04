import { attr, customElement } from '@ni/fast-element';
import { FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { SpinnerAppearance } from './types';

export const spinnerTag = 'nimble-spinner';

declare global {
    interface HTMLElementTagNameMap {
        [spinnerTag]: Spinner;
    }
}

/**
 * A Nimble-styled spinner component.
 * A spinner is an animating indicator that can be placed in a particular region of a page to represent loading progress, or an ongoing operation, of an indeterminate / unknown duration.
 */
@customElement({
    name: spinnerTag,
    template,
    styles
})
export class Spinner extends FoundationElement {
    /**
     * @public
     * @description
     * The appearance the spinner area should have.
     */
    @attr
    public appearance: SpinnerAppearance = SpinnerAppearance.default;
}
