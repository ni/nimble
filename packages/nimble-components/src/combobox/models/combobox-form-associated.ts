// Based on: https://github.com/microsoft/fast/blob/%40microsoft/fast-foundation_v2.49.5/packages/web-components/fast-foundation/src/combobox/combobox.form-associated.ts
/* eslint-disable max-classes-per-file */
import { FormAssociated, ListboxElement } from '@microsoft/fast-foundation';

// eslint-disable-next-line jsdoc/require-jsdoc
class Combobox extends ListboxElement {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Combobox extends FormAssociated {}

/**
 * A form-associated base class for the Combobox component. This was copied from the
 * FAST FormAssociatedCombobox (which is not exported by fast-foundation)
 *
 * @internal
 */
export class FormAssociatedCombobox extends FormAssociated(Combobox) {
    public proxy = document.createElement('input');
}
