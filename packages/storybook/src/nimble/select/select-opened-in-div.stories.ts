import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { createStory } from '../../utilities/storybook';
import { sharedMatrixParameters } from '../../utilities/matrix';

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
    <div style=${() => (position === 'below' ? 'height: 150px' : null)}>
        <div style="overflow: auto; border: 2px solid red; ${() => positionStyle}">
            <${selectTag} open position="${() => position}" style="width: 250px;">
                <${listOptionTag} value="1">Option 1</${listOptionTag}>
                <${listOptionTag} value="2">Option 2</${listOptionTag}>
                <${listOptionTag} value="3">Option 3</${listOptionTag}>
            </${selectTag}>
        </div>
    </div>
`;

export const openBelow$NotConfinedByDiv: StoryFn = createStory(
    component(positionStates[0])
);
export const openAbove$NotConfinedByDiv: StoryFn = createStory(
    component(positionStates[1])
);
