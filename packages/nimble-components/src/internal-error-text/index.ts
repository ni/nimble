import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-internal-error-text': InternalErrorText;
    }
}

/**
 * This component is meant to be used in template of other Nimble components that are
 * designed to display error text.
 */
export class InternalErrorText extends FoundationElement {
    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * @remarks
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText: string | undefined;
}

const nimbleInternalErrorText = InternalErrorText.compose({
    baseName: 'internal-error-text',
    baseClass: FoundationElement,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleInternalErrorText());
