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
    message?: CommitMessage;
    width: string;
}

const metadata: Meta<Args> = {
    title: 'Ok/Fv Edit Commit Bar',
    render: createUserSelectedThemeStory(html<Args>`
        <${fvEditCommitBarTag}
            style="width: ${x => x.width}; max-width: 100%"
            heading="Bulk Edit — 5 rows"
            :changeCount="${x => x.changeCount}"
            :affectedRowCount="${x => x.affectedRowCount}"
            :hiddenAffectedRowCount="${x => x.hiddenAffectedRowCount}"
            :message="${x => x.message}"
            ?save-disabled="${x => x.disabled || x.changeCount === 0}"
            ?revert-disabled="${x => x.disabled || x.changeCount === 0}"
        ></${fvEditCommitBarTag}>
    `),
    args: {
        changeCount: 0,
        affectedRowCount: 0,
        hiddenAffectedRowCount: 0,
        disabled: false,
        width: '100%'
    }
};

export default metadata;
export const fvEditCommitBar: StoryObj<Args> = {};
export const singular: StoryObj<Args> = { args: { changeCount: 1, affectedRowCount: 1 } };
export const plural: StoryObj<Args> = { args: { changeCount: 2, affectedRowCount: 5 } };
export const hiddenRows: StoryObj<Args> = { args: { changeCount: 2, affectedRowCount: 5, hiddenAffectedRowCount: 3 } };
export const saving: StoryObj<Args> = { args: { changeCount: 2, affectedRowCount: 5, disabled: true } };
export const success: StoryObj<Args> = { args: { message: { severity: 'information', text: 'Saved changes to 5 rows.' } } };
export const error: StoryObj<Args> = { args: { changeCount: 2, affectedRowCount: 5, message: { severity: 'error', text: 'Save failed. Pending edits are retained.' } } };
export const narrow: StoryObj<Args> = { args: { changeCount: 2, affectedRowCount: 5, width: '388px' } };
