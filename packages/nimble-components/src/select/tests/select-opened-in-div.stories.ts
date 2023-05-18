import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createStory } from '../../utilities/tests/storybook';
import { sharedMatrixParameters } from '../../utilities/tests/matrix';
import { selectTag } from '..';
import { listOptionTag } from '../../list-option';

const metadata: Meta = {
    title: 'Tests/Select',
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
        <${selectTag} open position="${() => position}">
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
            <${listOptionTag} value="2">Option 2</${listOptionTag}>
            <${listOptionTag} value="3">Option 3</${listOptionTag}>
        </${selectTag}>
    </div>
`;

export const selectBelowNotConfinedByDiv: StoryFn = createStory(
    component(positionStates[0])
);
export const selectAboveNotConfinedByDiv: StoryFn = createStory(
    component(positionStates[1])
);
