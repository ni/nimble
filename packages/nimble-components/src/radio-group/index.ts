import {
    RadioGroup as FoundationRadioGroup,
    DesignSystem
} from '@microsoft/fast-foundation';
import { Orientation } from '@microsoft/fast-web-utilities';
import { attr, observable } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { ErrorPattern } from '../patterns/error/types';
import { Radio } from '../radio';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-radio-group': RadioGroup;
    }
}

export { Orientation };

/**
 * A nimble-styled grouping element for radio buttons
 */
export class RadioGroup extends FoundationRadioGroup implements ErrorPattern {
    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText?: string;

    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;
}

const nimbleRadioGroup = RadioGroup.compose({
    baseName: 'radio-group',
    baseClass: FoundationRadioGroup,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleRadioGroup());
export const radioGroupTag = 'nimble-radio-group';
