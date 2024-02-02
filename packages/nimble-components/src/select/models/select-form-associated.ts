/* eslint-disable max-classes-per-file */
import { FormAssociated, ListboxElement } from '@microsoft/fast-foundation';

// eslint-disable-next-line jsdoc/require-jsdoc
class Select extends ListboxElement {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Select extends FormAssociated {}

/**
 * A form-associated base class for the Select component. This was copied from the
 * FAST FormAssociatedSelect (which is not exported by fast-foundation)
 *
 * @internal
 */
export class FormAssociatedSelect extends FormAssociated(Select) {
    public proxy = document.createElement('select');
}
