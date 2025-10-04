import { attr, customElement } from '@ni/fast-element';
import {
    Button as FoundationButton,
    buttonTemplate as template,
} from '@ni/fast-foundation';
import { styles } from './styles';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const cardButtonTag = 'nimble-card-button';

declare global {
    interface HTMLElementTagNameMap {
        [cardButtonTag]: CardButton;
    }
}

/**
 * A nimble-styled card button
 */
@customElement({
    name: cardButtonTag,
    template: template(elementDefinitionContextMock, {}),
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
})
export class CardButton extends FoundationButton {
    /**
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    @attr({ mode: 'boolean' })
    public selected = false;
}
