import { customElement } from '@ni/fast-element';
import {
    Radio as FoundationRadio,
    radioTemplate as template,
} from '@ni/fast-foundation';
import { circleFilled16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const radioTag = 'nimble-radio';

declare global {
    interface HTMLElementTagNameMap {
        [radioTag]: Radio;
    }
}

/**
 * A nimble-styled radio button
 */
@customElement({
    name: radioTag,
    template: template(elementDefinitionContextMock, {
        checkedIndicator: circleFilled16X16.data
    }),
    styles
})
export class Radio extends FoundationRadio {}
