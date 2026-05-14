// Based on: https://github.com/microsoft/fast/blob/%40microsoft/fast-foundation_v2.49.5/packages/web-components/fast-foundation/src/select/select.form-associated.ts
/* eslint-disable max-classes-per-file */
import { FormAssociated, FoundationElement } from '@ni/fast-foundation';

// eslint-disable-next-line jsdoc/require-jsdoc
class SelectVirtualized extends FoundationElement {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SelectVirtualized extends FormAssociated {}

/**
 * A form-associated base class for the SelectVirtualized component. This was copied from the
 * FAST FormAssociatedSelect (which is not exported by fast-foundation)
 *
 * @internal
 */
export class FormAssociatedSelectVirtualized extends FormAssociated(SelectVirtualized) {
    public proxy = document.createElement('select');
}
/* eslint-enable max-classes-per-file */
