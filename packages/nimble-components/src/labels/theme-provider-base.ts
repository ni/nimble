// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-components/build/generate-labels

import { attr } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import * as labels from '.';

/**
 * Base class of ThemeProvider that declares string resources / labels
 * @internal
 */
export class ThemeProviderBase extends FoundationElement {
    @attr({
        attribute: 'label-number-field-increment',
        mode: 'fromView'
    })
    public labelNumberFieldIncrement = 'Increment';

    @attr({
        attribute: 'label-number-field-decrement',
        mode: 'fromView'
    })
    public labelNumberFieldDecrement = 'Decrement';

    public labelNumberFieldIncrementChanged(
        _prev: string | undefined,
        next: string | undefined
    ): void {
        if (next !== undefined && next !== null) {
            labels.labelNumberFieldIncrement.setValueFor(this, next);
        } else {
            labels.labelNumberFieldIncrement.deleteValueFor(this);
        }
    }

    public labelNumberFieldDecrementChanged(
        _prev: string | undefined,
        next: string | undefined
    ): void {
        if (next !== undefined && next !== null) {
            labels.labelNumberFieldDecrement.setValueFor(this, next);
        } else {
            labels.labelNumberFieldDecrement.deleteValueFor(this);
        }
    }
}
