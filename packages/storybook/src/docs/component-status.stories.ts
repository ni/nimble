import { html, ref } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import { tableColumnAnchorTag } from '@ni/nimble-components/dist/esm/table-column/anchor';
import { tableColumnMappingTag } from '@ni/nimble-components/dist/esm/table-column/mapping';
import { mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import { iconCheckTag } from '@ni/nimble-components/dist/esm/icons/check';
import { iconTriangleTag } from '@ni/nimble-components/dist/esm/icons/triangle';
import { iconXmarkTag } from '@ni/nimble-components/dist/esm/icons/xmark';
import { tableFitRowsHeight } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { ComponentFrameworkStatus } from './types';
import { componentDataNimble } from './component-data/nimble';
import { componentDataSpright } from './component-data/spright';
import { componentDataOkFv } from './component-data/ok/fv';
import { componentDataOkTs } from './component-data/ok/ts';
import { componentDataFuture } from './component-data/future';
import {
    createUserSelectedThemeStory,
    fastParameters
} from '../utilities/storybook';

const libraryOptions = ['nimble', 'spright', 'ok', 'future'] as const;

interface TableArgs {
    tableRef: Table;
    updateData: (args: TableArgs) => void;
    library: (typeof libraryOptions)[number];
}

const components = [
    ...componentDataNimble,
    ...componentDataSpright,
    ...componentDataOkFv,
    ...componentDataOkTs,
    ...componentDataFuture,
] as const;

const iconMappings = html`
    <${mappingIconTag} key="${ComponentFrameworkStatus.ready}" text="Ready" icon="${iconCheckTag}" severity="success" text-hidden></${mappingIconTag}>
    <${mappingIconTag} key="${ComponentFrameworkStatus.incubating}" text="Incubating" icon="${iconTriangleTag}" severity="warning"></${mappingIconTag}>
    <${mappingIconTag} key="${ComponentFrameworkStatus.doesNotExist}" text="Does not exist" icon="${iconXmarkTag}" severity="error"></${mappingIconTag}>
`;

const metadata: Meta<TableArgs> = {
    title: 'Internal/Component Status',
    tags: [],
    decorators: [],
    parameters: {
        ...fastParameters()
    },
    render: createUserSelectedThemeStory(html<TableArgs>`
        <style class="code-hide">
            ${tableTag} {
                height: var(${tableFitRowsHeight.cssCustomProperty});
                max-height: none;
            }
        </style>
        <${tableTag}
            ${ref('tableRef')}
            data-unused="${x => x.updateData(x)}"
        >
            <${tableColumnAnchorTag} target="_top"
                column-id="component-name-column"
                label-field-name="componentName"
                href-field-name="componentHref"
                fractional-width=3
            >
                Component
            </${tableColumnAnchorTag}>
            <${tableColumnAnchorTag} target="_top"
                column-id="design-column"
                label-field-name="designLabel"
                href-field-name="designHref"
            >
                Design
            </${tableColumnAnchorTag}>
            <${tableColumnAnchorTag} target="_top"
                column-id="issue-column"
                label-field-name="issueLabel"
                href-field-name="issueHref"
            >
                Issue
            </${tableColumnAnchorTag}>
            <${tableColumnMappingTag}
                column-id="component-status-column"
                field-name="componentStatus"
                ?column-hidden="${x => x.library === 'future'}"
            >
                Web Component
                ${iconMappings}
            </${tableColumnMappingTag}>
            <${tableColumnMappingTag}
                column-id="angular-status-column"
                field-name="angularStatus"
                ?column-hidden="${x => x.library === 'future'}"
            >
                Angular
                ${iconMappings}
            </${tableColumnMappingTag}>
            <${tableColumnMappingTag}
                column-id="blazor-status-column"
                field-name="blazorStatus"
                ?column-hidden="${x => x.library === 'future'}"
            >
                Blazor
                ${iconMappings}
            </${tableColumnMappingTag}>
            <${tableColumnMappingTag}
                column-id="react-status-column"
                field-name="reactStatus"
                ?column-hidden="${x => x.library === 'future'}"
            >
                React
                ${iconMappings}
            </${tableColumnMappingTag}>
        </${tableTag}>
    `),
    argTypes: {
        tableRef: {
            table: {
                disable: true
            }
        },
        updateData: {
            table: {
                disable: true
            }
        },
        library: {
            options: [...libraryOptions],
            control: {
                type: 'radio'
            }
        }
    },
    args: {
        tableRef: undefined,
        updateData: x => {
            void (async () => {
                // Safari workaround: the table element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                const libraryComponents = components.filter(
                    component => component.library === x.library
                );
                await customElements.whenDefined(tableTag);
                await x.tableRef.setData(
                    libraryComponents.length > 0
                        ? libraryComponents
                        : [
                            {
                                componentName:
                                      'No components found for this library'
                            }
                        ]
                );
            })();
        },
        library: 'nimble'
    }
};

export default metadata;

export const componentStatus: StoryObj<TableArgs> = {
    parameters: {
        // Story used by documentation, not needed for visual comparison.
        chromatic: { disableSnapshot: true }
    }
};

export const componentStatusSpright: StoryObj<TableArgs> = {
    parameters: {
        // Story used by documentation, not needed for visual comparison.
        chromatic: { disableSnapshot: true }
    },
    args: {
        library: 'spright'
    }
};

export const componentStatusOk: StoryObj<TableArgs> = {
    parameters: {
        // Story used by documentation, not needed for visual comparison.
        chromatic: { disableSnapshot: true }
    },
    args: {
        library: 'ok'
    }
};

export const componentStatusFuture: StoryObj<TableArgs> = {
    parameters: {
        // Story used by documentation, not needed for visual comparison.
        chromatic: { disableSnapshot: true }
    },
    args: {
        library: 'future'
    }
};
