import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { listOptionTag } from '../../list-option';
import { comboboxTag } from '..';

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

// prettier-ignore
const component = ([
    position,
    positionStyle
]: PositionState): ViewTemplate => html`
    <div style="overflow: auto; border: 2px solid red; ${() => positionStyle}">
        <${comboboxTag} open position="${() => position}">
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
            <${listOptionTag} value="2">Option 2</${listOptionTag}>
            <${listOptionTag} value="3">Option 3</${listOptionTag}>
        </${comboboxTag}>
    </div>
`;

export const comboboxBelowNotConfinedByDiv: StoryFn = createStory(
    component(positionStates[0])
);
export const comboboxAboveNotConfinedByDiv: StoryFn = createStory(
    component(positionStates[1])
);
