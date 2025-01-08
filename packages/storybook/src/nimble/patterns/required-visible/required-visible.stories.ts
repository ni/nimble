import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import {
    groupHeaderFont,
    groupHeaderFontColor,
    largePadding,
    standardPadding
} from '../../../../../nimble-components/src/theme-provider/design-tokens';
import { comboboxTag } from '../../../../../nimble-components/src/combobox';
import { selectTag } from '../../../../../nimble-components/src/select';
import { textAreaTag } from '../../../../../nimble-components/src/text-area';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';
import {
    Orientation,
    radioGroupTag
} from '../../../../../nimble-components/src/radio-group';
import { radioTag } from '../../../../../nimble-components/src/radio';
import { textFieldTag } from '../../../../../nimble-components/src/text-field';
import { numberFieldTag } from '../../../../../nimble-components/src/number-field';

interface RequiredVisiblePatternArgs {
    shortLabel: string;
    longLabel: string;
}

const metadata: Meta<RequiredVisiblePatternArgs> = {
    title: 'Tests/Required Visible',
    parameters: {
        actions: {}
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
        <style class='code-hide'>
            .control-container {
                margin: var(${largePadding.cssCustomProperty});
                display: flex;
                flex-direction: column;
                gap: var(${standardPadding.cssCustomProperty});
            }

            .label {
                font: var(${groupHeaderFont.cssCustomProperty});
                color: var(${groupHeaderFontColor.cssCustomProperty});
            }

            .fixed-width {
                width: 200px;
            }
        </style>
        <div class="control-container">
            <div class="label">Combobox</div>
            <${comboboxTag} class="fixed-width" required-visible>${x => x.shortLabel}</${comboboxTag}>
            <${comboboxTag} class="fixed-width" required-visible>${x => x.longLabel}</${comboboxTag}>
        </div>
        <div class="control-container">
            <div class="label">Number field</div>
            <${numberFieldTag} class="fixed-width" required-visible>${x => x.shortLabel}</${numberFieldTag}>
            <${numberFieldTag} class="fixed-width" required-visible>${x => x.longLabel}</${numberFieldTag}>
        </div>
        <div class="control-container">
            <div class="label">Radio group</div>
            <${radioGroupTag} class="fixed-width" orientation=${Orientation.horizontal} required-visible>
                <span slot="label">${x => x.shortLabel}</span>
                <${radioTag} value="1">Option 1</${radioTag}>
                <${radioTag} value="2">Option 2</${radioTag}>
            </${radioGroupTag}>
            <${radioGroupTag} class="fixed-width" orientation=${Orientation.horizontal}  required-visible>
                <span slot="label">${x => x.longLabel}</span>
                <${radioTag} value="1">Option 1</${radioTag}>
                <${radioTag} value="2">Option 2</${radioTag}>
            </${radioGroupTag}>
            <${radioGroupTag} class="fixed-width" orientation=${Orientation.vertical} required-visible>
                <span slot="label">${x => x.shortLabel}</span>
                <${radioTag} value="1">Option 1</${radioTag}>
                <${radioTag} value="2">Option 2</${radioTag}>
            </${radioGroupTag}>
            <${radioGroupTag} class="fixed-width" orientation=${Orientation.vertical}  required-visible>
                <span slot="label">${x => x.longLabel}</span>
                <${radioTag} value="1">Option 1</${radioTag}>
                <${radioTag} value="2">Option 2</${radioTag}>
            </${radioGroupTag}>
        </div>
        <div class="control-container">
            <div class="label">Select</div>
            <${selectTag} class="fixed-width" required-visible>${x => x.shortLabel}</${selectTag}>
            <${selectTag} class="fixed-width" required-visible>${x => x.longLabel}</${selectTag}>
        </div>
        <div class="control-container">
            <div class="label">Text area</div>
            <${textAreaTag} class="fixed-width" required-visible>${x => x.shortLabel}</${textAreaTag}>
            <${textAreaTag} class="fixed-width" required-visible>${x => x.longLabel}</${textAreaTag}>
        </div>
        <div class="control-container">
            <div class="label">Text field</div>
            <${textFieldTag} class="fixed-width" required-visible>${x => x.shortLabel}</${textFieldTag}>
            <${textFieldTag} class="fixed-width" required-visible>${x => x.longLabel}</${textFieldTag}>
        </div>
    `),
    args: {
        shortLabel: 'Short label',
        longLabel: 'This is a long label that will wrap to the next line'
    }
};

export default metadata;

export const requiredVisiblePattern: StoryObj<RequiredVisiblePatternArgs> = {};
