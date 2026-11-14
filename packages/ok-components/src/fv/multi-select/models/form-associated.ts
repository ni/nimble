/* eslint-disable max-classes-per-file */
import { FormAssociated, FoundationElement } from '@ni/fast-foundation';

// eslint-disable-next-line jsdoc/require-jsdoc
class MultiSelect extends FoundationElement {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MultiSelect extends FormAssociated {}

/**
 * Form-associated base with a native multiple-select proxy.
 * @internal
 */
export class FormAssociatedMultiSelect extends FormAssociated(MultiSelect) {
    public proxy = Object.assign(document.createElement('select'), { multiple: true });
}
/* eslint-enable max-classes-per-file */
