import { ViewTemplate, html } from '@microsoft/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../../../../utilities/tests/matrix';
import { createMatrixThemeStory } from '../../../../../utilities/tests/storybook';
import { richTextMentionUsersViewTag } from '..';
import {
    disabledStates,
    type DisabledState
} from '../../../../../utilities/tests/states';
import {
    bodyFont,
    bodyFontColor,
    borderColor,
    borderWidth,
    mediumPadding,
    smallPadding
} from '../../../../../theme-provider/design-tokens';

const metadata: Meta = {
    title: 'Tests/Rich Text Mention: User',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = ([
    disabledName,
    disabled
]: DisabledState): ViewTemplate => html`
    <style class='code-hide'>
        .mention-container {
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
            margin: var(${smallPadding.cssCustomProperty});
        }
    </style>
    <div class="mention-container">
        [Mention View]<${richTextMentionUsersViewTag} mention-href="user:1" mention-label="John Doe" ?disabled="${() => disabled}" disable-editing>
            @John Doe
        </${richTextMentionUsersViewTag}>[View ${() => disabledName}]
    </div>
`;

const componentEditingMode = (): ViewTemplate => html`
    <style class='code-hide'>
        .mention-container {
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
            margin: var(${smallPadding.cssCustomProperty});
            padding: var(${mediumPadding.cssCustomProperty});
            border: var(${borderWidth.cssCustomProperty}) solid var(${borderColor.cssCustomProperty});
        }
    </style>
    <div class="mention-container" contenteditable="true">
        [Mention View]<${richTextMentionUsersViewTag} mention-href="user:1" mention-label="John Doe">
            @John Doe
        </${richTextMentionUsersViewTag}>[Enabled Editing]
    </div>
`;

export const richTextMentionUserViewThemeMatrix: StoryFn = createMatrixThemeStory(createMatrix(component, [disabledStates]));

export const richTextMentionUserViewEditEnabledThemeMatrix: StoryFn = createMatrixThemeStory(createMatrix(componentEditingMode));
