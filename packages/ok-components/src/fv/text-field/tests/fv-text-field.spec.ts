import { html } from '@ni/fast-element';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import {
    FvTextField,
    fvTextFieldTag,
    type MaskitoOptions
} from '..';

const groupedDigitsMask: MaskitoOptions = {
    mask: [/\d/, /\d/, '-', /\d/, /\d/]
};

const uppercaseGroupedMask: MaskitoOptions = {
    mask: [
        /[A-Za-z0-9]/,
        /[A-Za-z0-9]/,
        /[A-Za-z0-9]/,
        /[A-Za-z0-9]/,
        '-',
        /[A-Za-z0-9]/,
        /[A-Za-z0-9]/,
        /[A-Za-z0-9]/,
        /[A-Za-z0-9]/
    ],
    postprocessors: [({ value, selection }) => ({
        value: value.toUpperCase(),
        selection
    })]
};

async function setup(
    maskOptions?: MaskitoOptions
): Promise<Fixture<FvTextField>> {
    return await fixture<FvTextField>(
        html`<${fvTextFieldTag} :maskOptions="${() => maskOptions}"></${fvTextFieldTag}>`
    );
}

function typeCharacter(input: HTMLInputElement, character: string): void {
    const beforeInputEvent = new InputEvent('beforeinput', {
        bubbles: true,
        cancelable: true,
        composed: true,
        data: character,
        inputType: 'insertText'
    });
    const shouldPerformDefaultAction = input.dispatchEvent(beforeInputEvent);
    if (shouldPerformDefaultAction) {
        input.setRangeText(character, input.selectionStart ?? 0, input.selectionEnd ?? 0, 'end');
        input.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            composed: true,
            data: character,
            inputType: 'insertText'
        }));
    }
}

describe('FvTextField', () => {
    let element: FvTextField;
    let connect: () => Promise<void>;
    let disconnect: (() => Promise<void>) | undefined;

    afterEach(async () => {
        await disconnect?.();
        disconnect = undefined;
    });

    it('can construct an element instance', () => {
        expect(document.createElement(fvTextFieldTag)).toBeInstanceOf(FvTextField);
    });

    it('renders inherited error and actions content', async () => {
        ({ element, connect, disconnect } = await fixture<FvTextField>(html`
            <${fvTextFieldTag} error-text="Invalid value">
                <button slot="actions">Action</button>
            </${fvTextFieldTag}>
        `));
        await connect();

        expect(element.shadowRoot?.querySelector('.error-icon')).not.toBeNull();
        expect(element.shadowRoot?.querySelector('.error-text')?.textContent?.trim()).toBe('Invalid value');
        expect(
            element.shadowRoot
                ?.querySelector<HTMLSlotElement>('slot[name="actions"]')
                ?.assignedElements()
        ).toHaveSize(1);
    });

    it('applies mask options to user input', async () => {
        ({ element, connect, disconnect } = await setup(groupedDigitsMask));
        await connect();
        element.control.focus();

        typeCharacter(element.control, '1');
        typeCharacter(element.control, '2');
        typeCharacter(element.control, '3');
        typeCharacter(element.control, '4');

        expect(element.control.value).toBe('12-34');
        expect(element.value).toBe('12-34');
    });

    it('supports uppercase grouped alphanumeric input', async () => {
        ({ element, connect, disconnect } = await setup(uppercaseGroupedMask));
        await connect();
        element.control.focus();

        typeCharacter(element.control, 'a');
        typeCharacter(element.control, 'b');
        typeCharacter(element.control, '1');
        typeCharacter(element.control, '2');
        typeCharacter(element.control, 'c');
        typeCharacter(element.control, 'd');
        typeCharacter(element.control, '3');
        typeCharacter(element.control, '4');

        expect(element.control.value).toBe('AB12-CD34');
        expect(element.value).toBe('AB12-CD34');
    });

    it('masks a programmatically assigned value', async () => {
        ({ element, connect, disconnect } = await setup(groupedDigitsMask));
        await connect();

        element.value = '1234';
        await waitForUpdatesAsync();

        expect(element.value).toBe('12-34');
        expect(element.control.value).toBe('12-34');
    });

    it('replaces the active mask when mask options change', async () => {
        ({ element, connect, disconnect } = await setup(groupedDigitsMask));
        await connect();
        element.value = '1234';
        await waitForUpdatesAsync();

        element.maskOptions = { mask: [/\d/, '-', /\d/, '-', /\d/, /\d/] };
        await waitForUpdatesAsync();

        expect(element.value).toBe('1-2-34');
        expect(element.control.value).toBe('1-2-34');
    });

    it('accepts unmasked input when mask options are not configured', async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();

        element.control.value = 'unmasked value';
        element.control.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            composed: true,
            data: 'unmasked value',
            inputType: 'insertText'
        }));

        expect(element.value).toBe('unmasked value');
    });
});