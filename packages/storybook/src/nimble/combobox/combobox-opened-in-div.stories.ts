import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { Combobox, comboboxTag } from '@ni/nimble-components/dist/esm/combobox';
import { createStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';

const metadata: Meta = {
    title: 'Tests/Combobox',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const positionStates = [
    ['below', ''],
    ['above', 'margin-top: 120px;']
] as const;
type PositionState = (typeof positionStates)[number];

const component = ([
    position,
    positionStyle
]: PositionState): ViewTemplate => html`
    <div style=${() => (position === 'below' ? 'height: 150px' : null)}>
        <div style="overflow: auto; border: 2px solid red; ${() => positionStyle}">
            <${comboboxTag} position="${() => position}" style="width: 250px;">
                <${listOptionTag} value="1">Option 1</${listOptionTag}>
                <${listOptionTag} value="2">Option 2</${listOptionTag}>
                <${listOptionTag} value="3">Option 3</${listOptionTag}>
            </${comboboxTag}>
        </div>
    </div>
`;

const openStory = (story: StoryFn): StoryFn => {
    story.play = async ({ canvasElement }) => {
        const combobox = canvasElement.querySelector<Combobox>(comboboxTag)!;
        const toggled = new Promise<void>(resolve => {
            combobox.addEventListener('toggle', () => resolve(), { once: true });
        });
        combobox.open();
        await toggled;
    };
    return story;
};

export const openBelow$NotConfinedByDiv: StoryFn = openStory(
    createStory(component(positionStates[0]))
);
export const openAbove$NotConfinedByDiv: StoryFn = openStory(
    createStory(component(positionStates[1]))
);
