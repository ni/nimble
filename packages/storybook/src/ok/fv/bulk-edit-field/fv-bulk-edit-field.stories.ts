import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, when } from '@ni/fast-element';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { textAreaTag } from '@ni/nimble-components/dist/esm/text-area';
import { numberFieldTag } from '@ni/nimble-components/dist/esm/number-field';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { fvBulkEditFieldTag } from '@ni/ok-components/dist/esm/fv/bulk-edit-field';
import type { BulkEditFieldStatus } from '@ni/ok-components/dist/esm/fv/bulk-edit-field/types';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';

interface Args {
    status: BulkEditFieldStatus;
    control: 'text' | 'textarea' | 'select' | 'number';
    actionsDisabled: boolean;
}

const metadata: Meta<Args> = {
    title: 'Ok/Fv Bulk Edit Field',
    render: createUserSelectedThemeStory(html<Args>`
        <${fvBulkEditFieldTag}
            style="display: block; width: min(360px, 100%)"
            label="Location"
            status="${x => x.status}"
            ?reset-disabled="${x => x.actionsDisabled || x.status === 'unchanged' || x.status === 'mixed'}"
            ?clear-disabled="${x => x.actionsDisabled}"
        >
            ${when(x => x.control === 'text', html`<${textFieldTag}></${textFieldTag}>`)}
            ${when(x => x.control === 'textarea', html`<${textAreaTag}></${textAreaTag}>`)}
            ${when(x => x.control === 'number', html`<${numberFieldTag}></${numberFieldTag}>`)}
            ${when(x => x.control === 'select', html`<${selectTag}><${listOptionTag}>Austin</${listOptionTag}></${selectTag}>`)}
        </${fvBulkEditFieldTag}>
    `),
    args: { status: 'unchanged', control: 'text', actionsDisabled: false },
    argTypes: {
        status: {
            control: 'select',
            options: ['unchanged', 'mixed', 'changed', 'will-clear']
        },
        control: {
            control: 'select',
            options: ['text', 'textarea', 'select', 'number']
        },
        actionsDisabled: { control: 'boolean' }
    }
};

export default metadata;
export const fvBulkEditField: StoryObj<Args> = {};
