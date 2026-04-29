import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { fvSummaryPanelTag } from '@ni/ok-components/dist/esm/fv/summary-panel';
import { fvSummaryPanelTileTag } from '@ni/ok-components/dist/esm/fv/summary-panel-tile';
import {
    apiCategory,
    createUserSelectedThemeStory,
    okWarning
} from '../../../utilities/storybook';

interface FvSummaryPanelArgs {
    showEditItemsButton: boolean;
    editItemsButtonLabel: string;
    legacyStyle: boolean;
    tileTextPosition: 'beside' | 'under';
    click?: (e: Event) => void;
    editItems?: (e: Event) => void;
}

const summaryItems = html<FvSummaryPanelArgs>`
    <${fvSummaryPanelTileTag} count="852" label="files" text-position="${x => x.tileTextPosition}"></${fvSummaryPanelTileTag}>
    <${fvSummaryPanelTileTag} count="1234" label="test results" text-position="${x => x.tileTextPosition}"></${fvSummaryPanelTileTag}>
    <${fvSummaryPanelTileTag} count="93" label="systems" text-position="${x => x.tileTextPosition}" selected></${fvSummaryPanelTileTag}>
    <${fvSummaryPanelTileTag} count="0" label="notebooks" text-position="${x => x.tileTextPosition}"></${fvSummaryPanelTileTag}>
    <${fvSummaryPanelTileTag} count="15" label="executions" text-position="${x => x.tileTextPosition}"></${fvSummaryPanelTileTag}>
    <${fvSummaryPanelTileTag} count="66" label="routines" text-position="${x => x.tileTextPosition}"></${fvSummaryPanelTileTag}>
`;

const metadata: Meta<FvSummaryPanelArgs> = {
    title: 'Ok/Fv Summary Panel',
    render: createUserSelectedThemeStory(html<FvSummaryPanelArgs>`
        ${okWarning({
            componentName: 'fv summary panel',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <${fvSummaryPanelTag}
            ?show-edit-items-button="${x => x.showEditItemsButton}"
            edit-items-button-label="${x => x.editItemsButtonLabel}"
            ?legacy-style="${x => x.legacyStyle}"
        >
            ${summaryItems}
        </${fvSummaryPanelTag}>
    `),
    argTypes: {
        showEditItemsButton: {
            name: 'show-edit-items-button',
            table: { category: apiCategory.attributes }
        },
        editItemsButtonLabel: {
            name: 'edit-items-button-label',
            table: { category: apiCategory.attributes }
        },
        legacyStyle: {
            name: 'legacy-style',
            table: { category: apiCategory.attributes }
        },
        tileTextPosition: {
            name: 'text-position',
            options: ['beside', 'under'],
            control: { type: 'radio' },
            table: { category: apiCategory.attributes }
        },
        editItems: {
            name: 'edit-items',
            description: 'Event emitted when the built-in edit-items button is activated.',
            table: { category: apiCategory.events },
            control: false
        },
        click: {
            description: 'Event emitted when the user activates a summary tile.',
            table: { category: apiCategory.events },
            control: false
        }
    },
    args: {
        showEditItemsButton: true,
        editItemsButtonLabel: 'Configure',
        legacyStyle: false,
        tileTextPosition: 'beside'
    }
};

export default metadata;

export const fvSummaryPanel: StoryObj<FvSummaryPanelArgs> = {};