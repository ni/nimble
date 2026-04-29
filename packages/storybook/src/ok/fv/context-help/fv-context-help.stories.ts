import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { fvContextHelpTag } from '@ni/ok-components/dist/esm/fv/context-help';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';

interface FvContextHelpArgs {
    text: string;
}

const metadata: Meta<FvContextHelpArgs> = {
    title: 'Ok/Fv Context Help',
    render: createUserSelectedThemeStory(html`
        <${textFieldTag}
            id="context-help-text-field"
            placeholder="Enter a schedule"
        >Calibration schedule 
            <${fvContextHelpTag}
                text="${x => x.text}"
            </${fvContextHelpTag}>
        </${textFieldTag}>
    `),
    argTypes: {
        text: {
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        text: 'Calibration assets include service history.'
    }
};

export default metadata;

export const fvContextHelp: StoryObj<FvContextHelpArgs> = {};
