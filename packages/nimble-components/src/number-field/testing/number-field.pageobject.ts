import type { NumberField } from '..';

/**
 * Page object for `nimble-number-field` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class NumberFieldPageObject {
    public constructor(protected readonly numberFieldElement: NumberField) {}

    /**
     * @returns The string visible in the control.
     */
    public getDisplayValue(): string {
        return this.inputControl.value;
    }

    /**
     * Inputs the given text via a single input event.
     */
    public inputText(text: string): void {
        this.inputTextInternal(text);
    }

    /**
     * Inputs the given text via a single input event, replacing any text that was already there.
     */
    public setText(text: string): void {
        this.inputTextInternal(text, true);
    }

    private inputTextInternal(text: string, replace = false): void {
        this.inputControl.value = text;
        this.inputControl.dispatchEvent(
            new InputEvent('input', {
                data: text,
                inputType: replace ? 'deleteContentForward' : 'insertText'
            })
        );
    }

    private get inputControl(): HTMLInputElement {
        return this.numberFieldElement.shadowRoot!.querySelector('input')!;
    }
}
