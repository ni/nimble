import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import {
    type CommitMessage,
    fvEditCommitBarTag
} from '@ni/ok-components/dist/esm/fv/edit-commit-bar';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';

interface Args {
    changeCount: number;
    affectedRowCount: number;
    hiddenAffectedRowCount: number;
    disabled: boolean;
    messageSeverity: 'none' | CommitMessage['severity'];
    messageText: string;
    width: string;
}

const metadata: Meta<Args> = {
    title: 'Ok/Fv Edit Commit Bar',
    render: createUserSelectedThemeStory(html<Args>`
        <${fvEditCommitBarTag}
            style="width: ${x => x.width}; max-width: 100%"
        heading="Bulk Edit — ${x => x.affectedRowCount} rows"
            :changeCount="${x => x.changeCount}"
            :affectedRowCount="${x => x.affectedRowCount}"
            :hiddenAffectedRowCount="${x => x.hiddenAffectedRowCount}"
            :message="${x => (x.messageSeverity === 'none' || !x.messageText ? undefined : { severity: x.messageSeverity, text: x.messageText })}"
            ?save-disabled="${x => x.disabled || x.changeCount === 0}"
            ?revert-disabled="${x => x.disabled || x.changeCount === 0}"
        ></${fvEditCommitBarTag}>
    `),
    args: {
        changeCount: 0,
        affectedRowCount: 0,
        hiddenAffectedRowCount: 0,
        disabled: false,
        messageSeverity: 'none',
        messageText: '',
        width: '100%'
    },
    argTypes: {
        changeCount: { control: { type: 'number', min: 0, step: 1 } },
        affectedRowCount: { control: { type: 'number', min: 0, step: 1 } },
        hiddenAffectedRowCount: { control: { type: 'number', min: 0, step: 1 } },
        disabled: { control: 'boolean' },
        messageSeverity: { control: 'select', options: ['none', 'information', 'error'] },
        messageText: { control: 'text' },
        width: { control: 'text' }
    }
};

export default metadata;
export const fvEditCommitBar: StoryObj<Args> = {};
