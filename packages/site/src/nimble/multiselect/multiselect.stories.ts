import { html } from '@ni/fast-element';
import type { Meta } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { multiselectTag } from '@ni/nimble-components/dist/esm/multiselect';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';

const metadata: Meta = {
    title: 'Components/MultiSelect',
    decorators: [withActions],
    parameters: {
        actions: { handles: ['change', 'input'] }
    },
    render: html`
        <style>
            .container { padding: 16px; }
        </style>
        <div class="container">
            <${multiselectTag} appearance="underline" filter-mode="standard">
                <${listOptionTag} value="one">One</${listOptionTag}>
                <${listOptionTag} value="two">Two</${listOptionTag}>
                <${listOptionTag} value="three">Three</${listOptionTag}>
                <${listOptionTag} value="four">Four</${listOptionTag}>
            </${multiselectTag}>
        </div>
    `
};

export default metadata;
