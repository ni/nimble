import { ViewTemplate, html } from '@microsoft/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../../../../utilities/tests/matrix';
import { createMatrixThemeStory } from '../../../../../utilities/tests/storybook';
import { richTextMentionUsersViewTag } from '..';
import { disabledStates, type DisabledState } from '../../../../../utilities/tests/states';
import { bodyFont, bodyFontColor } from '../../../../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Rich Text Mention: User',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [disabledName, disabled]: DisabledState,
): ViewTemplate => html`
    <style class='code-hide'>
        .mention-container {
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
        }
    </style>
    <div class="mention-container">
        <${richTextMentionUsersViewTag} mention-href="user:1" mention-label="John Doe" ?disabled="${() => disabled}">
        </${richTextMentionUsersViewTag}> -
        Mention View ${() => disabledName}
    </div>
`;

export const richTextMentionUsersThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates
    ])
);
