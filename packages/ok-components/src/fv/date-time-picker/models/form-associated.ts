/* eslint-disable max-classes-per-file */
import { FormAssociated, FoundationElement } from '@ni/fast-foundation';

// eslint-disable-next-line jsdoc/require-jsdoc
class DateTimePicker extends FoundationElement {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DateTimePicker extends FormAssociated {}

/**
 * Form association without the unrelated text-input attributes of TextField.
 * @internal
 */
export class FormAssociatedDateTimePicker extends FormAssociated(DateTimePicker) {
    public proxy = document.createElement('input');
}
/* eslint-enable max-classes-per-file */
