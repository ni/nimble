import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { fvContextHelpTag } from '@ni/ok-components/dist/esm/fv/context-help';
import {
    apiCategory,
    createUserSelectedThemeStory,
    okWarning
} from '../../../utilities/storybook';

interface FvContextHelpArgs {
    text: string;
    triggerLabel: string;
}

const metadata: Meta<FvContextHelpArgs> = {
    title: 'Ok/Fv Context Help',
    render: createUserSelectedThemeStory(html`
        ${okWarning({
            componentName: 'fv context help',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <${textFieldTag}
            id="context-help-text-field"
            placeholder="Enter a schedule"
        >Calibration schedule 
            <${fvContextHelpTag}
                text="${x => x.text}"
                trigger-label="${x => x.triggerLabel}"
            </${fvContextHelpTag}>
        </${textFieldTag}>
    `),
    argTypes: {
        text: {
            table: { category: apiCategory.attributes }
        },
        triggerLabel: {
            name: 'trigger-label',
            description: 'Accessible label announced for the help trigger button.',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        text: 'Calibration assets include service history.',
        triggerLabel: 'Show help for calibration schedule'
    }
};

export default metadata;

export const fvContextHelp: StoryObj<FvContextHelpArgs> = {};
