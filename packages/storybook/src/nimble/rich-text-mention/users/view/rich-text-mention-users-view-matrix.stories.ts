import { ViewTemplate, html } from '@ni/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import {
    bodyFont,
    bodyFontColor,
    smallPadding
} from '../../../../../../nimble-components/src/theme-provider/design-tokens';
import { richTextMentionUsersViewTag } from '../../../../../../nimble-components/src/rich-text-mention/users/view';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../../../utilities/matrix';
import {
    type DisabledState,
    disabledStates
} from '../../../../utilities/states';

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
            margin: var(${smallPadding.cssCustomProperty});
        }

        .sample-text {
            font: var(${bodyFont.cssCustomProperty});
            color: var(${bodyFontColor.cssCustomProperty});
        }
    </style>
    <div class="mention-container">
        <span class="sample-text">User mention:</span>
        <${richTextMentionUsersViewTag}
            mention-href="user:1"
            mention-label="John Doe"
            ?disabled="${() => disabled}"
        >@John Doe</${richTextMentionUsersViewTag}>
        <span class="sample-text">(Mention View ${() => disabledName})</span>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(createMatrix(component, [disabledStates]));
