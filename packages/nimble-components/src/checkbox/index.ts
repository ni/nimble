import { attr, customElement, nullableNumberConverter } from '@ni/fast-element';
import { Checkbox as FoundationCheckbox } from '@ni/fast-foundation';
import { check16X16, minus16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';
import { template } from './template';
import { mixinErrorPattern } from '../patterns/error/types';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const checkboxTag = 'nimble-checkbox';

declare global {
    interface HTMLElementTagNameMap {
        [checkboxTag]: Checkbox;
    }
}

/**
 * A nimble-styled checkbox control.
 */
@customElement({
    name: checkboxTag,
    template: template(elementDefinitionContextMock, {
        checkedIndicator: check16X16.data,
        indeterminateIndicator: minus16X16.data
    }),
    styles
})
export class Checkbox extends mixinErrorPattern(FoundationCheckbox) {
    /**
     * @public
     * @remarks
     * HTML Attribute: tabindex
     */
    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;

    /**
     * @internal
     */
    public get resolvedTabindex(): string | undefined {
        const tabIndex = this.tabIndex ?? 0;
        return this.disabled ? undefined : `${tabIndex}`;
    }
}
