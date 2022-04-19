/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable storybook/await-interactions */
import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { userEvent } from '@storybook/testing-library';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import { ButtonAppearance } from '../types';
import '..';

const metadata: Meta = {
    title: 'Tests/Button/Interactions',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
            'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/42001df1-2969-438e-b353-4327d7a15102/specs/'
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
const component = (appearance: ButtonAppearance): ViewTemplate => html`
    <nimble-button
        appearance="${() => appearance}"
    >
    Button
    </nimble-button>
`;

const initForFocused = (story: Story): void => {
    story.play = async ({ _args, canvasElement }): Promise<void> => {
        const nimbleButton = canvasElement.querySelector('nimble-button')!;
        const button = nimbleButton.shadowRoot!.querySelector('button')!;
        userEvent.click(button);
    };
};

export const focusedOutline: Story = createRenderer(component(ButtonAppearance.Outline));
initForFocused(focusedOutline);
export const focusedGhost: Story = createRenderer(component(ButtonAppearance.Ghost));
initForFocused(focusedGhost);
export const focusedBlock: Story = createRenderer(component(ButtonAppearance.Block));
initForFocused(focusedBlock);