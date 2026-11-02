import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { html } from '@ni/fast-element';
import { fvFilterBarTag } from '@ni/ok-components/dist/esm/fv/filter-bar';
import type {
    FvFilterBarDefinition,
    FvFilterBarQueryDocument
} from '@ni/ok-components/dist/esm/fv/filter-bar/types';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';

interface FilterBarArgs {
    label: string;
    query: FvFilterBarQueryDocument;
    definition: FvFilterBarDefinition;
    disabled: boolean;
    showClearButton: boolean;
}

const definition = {
    version: 1,
    fields: [
        {
            id: 'status',
            path: '/status',
            label: 'Status',
            operatorIds: ['is-any-of'],
            valueSchema: {
                oneOf: [
                    { const: 'failed', title: 'Failed' },
                    { const: 'error', title: 'Error' }
                ]
            }
        },
        {
            id: 'duration',
            path: '/duration',
            label: 'Duration',
            operatorIds: ['greater-than'],
            valueSchema: { type: 'number' }
        },
        {
            id: 'name',
            path: '/name',
            label: 'Name',
            operatorIds: ['contains'],
            valueSchema: { type: 'string' }
        }
    ],
    operators: [
        { id: 'is-any-of', label: 'Is any of', operand: { kind: 'field-value-list' } },
        { id: 'greater-than', label: 'Greater than', operand: { kind: 'field-value' } },
        { id: 'contains', label: 'Contains', operand: { kind: 'field-value' } }
    ]
} as const;

const query: FvFilterBarQueryDocument = {
    version: 1,
    root: {
        kind: 'group',
        combinator: 'and',
        children: [
            {
                kind: 'group',
                combinator: 'or',
                children: [
                    { kind: 'predicate', fieldId: 'status', operatorId: 'is-any-of', value: ['failed', 'error'] },
                    { kind: 'predicate', fieldId: 'duration', operatorId: 'greater-than', value: 1000 }
                ]
            },
            { kind: 'predicate', fieldId: 'name', operatorId: 'contains', value: 'regression' }
        ]
    }
};

const metadata: Meta<FilterBarArgs> = {
    title: 'Ok/Fv Filter Bar',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['edit-filter', 'clear-filter']
        }
    },
    render: createUserSelectedThemeStory(html<FilterBarArgs>`
        <${fvFilterBarTag}
            label="${x => x.label}"
            :query="${x => x.query}"
            :definition="${x => x.definition}"
            ?disabled="${x => x.disabled}"
            :showClearButton="${x => x.showClearButton}"
        ></${fvFilterBarTag}>
    `),
    args: {
        label: 'More than 1000 items were found',
        query,
        definition,
        disabled: false,
        showClearButton: true
    }
};

export default metadata;

export const withValues: StoryObj<FilterBarArgs> = {};

export const withoutValues: StoryObj<FilterBarArgs> = {
    args: { query: { version: 1, root: null } }
};
