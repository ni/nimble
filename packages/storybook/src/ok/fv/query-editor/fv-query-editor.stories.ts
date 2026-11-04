import type { Meta, StoryObj } from '@storybook/html-vite';
import { html } from '@ni/fast-element';
import {
    fvQueryEditorTag,
    type QueryBuilderDefinition,
    type QueryDocument,
    type QueryEditorLayout
} from '@ni/ok-components/dist/esm/fv/query-editor';
import {
    apiCategory,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    okWarning
} from '../../../utilities/storybook';
import { queryBuilderDefinition } from '../query-builder/fixtures';
import { queryEditorPresets } from './fixtures';

interface StoryArgs {
    label: string;
    disabled: boolean;
    defaultField: string;
    layout: QueryEditorLayout;
    preset: keyof typeof queryEditorPresets;
    definition: QueryBuilderDefinition;
    query?: QueryDocument;
}

const metadata: Meta<StoryArgs> = {
    title: 'Ok/Fv Query Editor',
    render: createUserSelectedThemeStory(html<StoryArgs>`
        ${okWarning({
            componentName: 'fv query editor',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        ${disableStorybookZoomTransform}
        <div style="max-width: 1000px; padding: 16px; min-height: 640px; box-sizing: border-box;">
            <${fvQueryEditorTag}
                label="${x => x.label}"
                :disabled="${x => x.disabled}"
                default-field="${x => x.defaultField}"
                layout="${x => x.layout}"
                :definition="${x => x.definition}"
                :query="${x => structuredClone(x.query ?? queryEditorPresets[x.preset])}"
            ></${fvQueryEditorTag}>
        </div>
    `),
    argTypes: {
        label: {
            description: 'Accessible name for the query editor.',
            table: { category: apiCategory.attributes }
        },
        disabled: { control: 'boolean', description: 'Disable interaction with the query editor.', table: { category: apiCategory.attributes } },
        defaultField: {
            name: 'default-field',
            description: 'Field to use when adding a condition without choosing a field from autocomplete.',
            table: { category: apiCategory.attributes }
        },
        layout: {
            description: 'Display conditions inline or on separate rows with indented groups.',
            control: 'radio',
            options: ['inline', 'formatted'],
            table: { category: apiCategory.attributes }
        },
        definition: {
            control: 'object',
            description: 'Fields and operators available in the query editor.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        query: {
            control: 'object',
            description: 'Custom query document. When set, this overrides the selected preset.',
            table: { category: apiCategory.nonAttributeProperties }
        },
        preset: {
            description: 'Sample query to edit when no custom query is set.',
            control: 'select',
            options: Object.keys(queryEditorPresets),
            table: { category: 'Demo' }
        }
    },
    args: {
        label: 'Query conditions',
        disabled: false,
        defaultField: '',
        layout: 'inline',
        preset: 'basic',
        definition: queryBuilderDefinition
    }
};

export default metadata;

export const configurable: StoryObj<StoryArgs> = {};
