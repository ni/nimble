import {
    DesignSystem,
    Checkbox as FoundationCheckbox,
} from '@microsoft/fast-foundation';

/**
 * An unstyled Nimble checkbox control.
 */
export class Checkbox extends FoundationCheckbox {}
export const checkboxTag = DesignSystem.tagFor(Checkbox);
