import {
    DesignSystem,
    TextArea as FoundationTextArea,
    textAreaTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export type { TextArea };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-text-area': TextArea;
    }
}

/**
 * A nimble-styed HTML text area
 */
class TextArea extends FoundationTextArea {}

const nimbleTextArea = TextArea.compose({
    baseName: 'text-area',
    baseClass: FoundationTextArea,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextArea());
