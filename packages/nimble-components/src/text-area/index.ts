import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    TextArea as FoundationTextArea,
    textAreaTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { TextAreaAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-text-area': TextArea;
    }
}

/**
 * A nimble-styed HTML text area
 */
export class TextArea extends FoundationTextArea {
    /**
     * The appearance the text area should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: TextAreaAppearance = TextAreaAppearance.outline;
}

const nimbleTextArea = TextArea.compose({
    baseName: 'text-area',
    baseClass: FoundationTextArea,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextArea());
export const textAreaTag = DesignSystem.tagFor(TextArea);
