/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable storybook/await-interactions */
import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { userEvent } from '@storybook/testing-library';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import { TextFieldAppearance } from '../types';
import '..';

const metadata: Meta = {
    title: 'Tests/Text Field/Interactions',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/842889a5-67ba-4350-91c1-55eee48f4fa2/specs/'
        },
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
    }
};

export default metadata;

/*
const withinShadowDom = (element: HTMLElement) => {
    const firstNonLabelChild = Array.from(element.shadowRoot!.children).find(c => !(c instanceof HTMLLabelElement));
    return within(firstNonLabelChild as HTMLElement);
};
*/

// prettier-ignore
const component = (appearance: TextFieldAppearance): ViewTemplate => html`
    <nimble-text-field
        style="width: 250px; padding: 15px;"
        appearance="${() => appearance}"
        placeholder="Text Field"
    >
    Focused Text Field
    </nimble-text-field>
`;

const initForFocused = (story: Story): void => {
    story.play = async ({ _args, canvasElement }): Promise<void> => {
        // const canvas = within(canvasElement);
        // const nimbleTextField = canvas.getByPlaceholderText('Text Field');
        // const textInput = withinShadowDom(nimbleTextField).getByRole('textbox');
        const nimbleTextField = canvasElement.querySelector('nimble-text-field');
        const textInput = nimbleTextField!.shadowRoot!.querySelector('input')!;
        userEvent.click(textInput);
    };
};

export const focusedUnderline: Story = createRenderer(component(TextFieldAppearance.Underline));
initForFocused(focusedUnderline);
export const focusedOutline: Story = createRenderer(component(TextFieldAppearance.Outline));
initForFocused(focusedOutline);
export const focusedBlock: Story = createRenderer(component(TextFieldAppearance.Block));
initForFocused(focusedBlock);