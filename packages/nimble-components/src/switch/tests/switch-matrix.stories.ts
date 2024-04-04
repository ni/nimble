import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/tests/matrix';
import { disabledStates, DisabledState } from '../../utilities/tests/states';
import { createStory } from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { switchTag } from '..';

const checkedStates = [
    ['Checked', true],
    ['Unchecked', false]
] as const;
type CheckedState = (typeof checkedStates)[number];

const messagesStates = [
    ['With Messages', true],
    ['Without Messages', false]
] as const;
type MessagesState = (typeof messagesStates)[number];

const metadata: Meta = {
    title: 'Tests/Switch',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [checkedName, checked]: CheckedState,
    [disabledName, disabled]: DisabledState,
    [messagesName, messages]: MessagesState
): ViewTemplate => html`
    <${switchTag}
        ?disabled=${() => disabled}
        ?checked=${() => checked}
        style="margin-right: 8px; margin-bottom: 8px;">
            ${() => `${checkedName} Switch ${disabledName} ${messagesName}`}
            ${when(() => messages, html`<span slot="checked-message">On</span><span slot="unchecked-message">Off</span>`)}
    </${switchTag}>
`;

export const switchThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [checkedStates, disabledStates, messagesStates])
);

// prettier-ignore
export const hiddenSwitch: StoryFn = createStory(
    hiddenWrapper(
        html`<${switchTag} hidden>Hidden Switch</${switchTag}>`
    )
);

export const heightTest: StoryFn = createStory(
    html`
        <div style="display: flex; flex-direction: column">
            <${switchTag} style="border: 1px dashed; width: 200px">
                With Label
                <span slot="checked-message">On</span>
                <span slot="unchecked-message">Off</span>
            </${switchTag}>
            <${switchTag} style="border: 1px dashed; width: 200px">
                <span slot="checked-message">On</span>
                <span slot="unchecked-message">Off</span>
            </${switchTag}>
        </div>
    `
);
