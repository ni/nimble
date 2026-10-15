import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { html, ref } from '@ni/fast-element';
import {
    type FvSplitter,
    fvSplitterTag
} from '@ni/ok-components/dist/esm/fv/splitter';
import { type Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { textAreaTag } from '@ni/nimble-components/dist/esm/text-area';
import {
    applicationBackgroundColor,
    bodyFont,
    bodyFontColor,
    dividerBackgroundColor,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    apiCategory,
    createUserSelectedThemeStory,
    okWarning
} from '../../../utilities/storybook';

interface SplitterArgs {
    position: number;
    min: number;
    max: number;
    step: number;
    tableRef: Table;
    updateTableData: (args: SplitterArgs) => void;
    input?: (event: Event) => void;
    change?: (event: Event) => void;
}

const systems = [
    { name: 'PXI-1095-01', status: 'Online', location: 'Austin' },
    { name: 'cRIO-9049-07', status: 'Running', location: 'Munich' },
    { name: 'PXIe-8881-03', status: 'Offline', location: 'Penang' }
] as const;

const storyStyles = `
    .splitter-story {
        display: grid;
        width: min(960px, 100%);
        height: 520px;
        overflow: hidden;
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        background: var(${applicationBackgroundColor.cssCustomProperty});
    }

    .splitter-story__primary,
    .splitter-story__secondary {
        min-width: 0;
        overflow: auto;
    }

    .splitter-story__primary {
        padding: 24px;
    }

    .splitter-story__toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-block-end: 24px;
    }

    .splitter-story h2,
    .splitter-story p {
        margin-block-start: 0;
    }

    .splitter-story ${tableTag} {
        width: 100%;
        height: 220px;
    }

    .splitter-story__secondary {
        display: flex;
        flex-direction: column;
        background: var(${applicationBackgroundColor.cssCustomProperty});
    }

    .splitter-story__secondary header {
        padding: var(${standardPadding.cssCustomProperty});
        background: var(${applicationBackgroundColor.cssCustomProperty});
        border-block-end: 1px solid var(${dividerBackgroundColor.cssCustomProperty});
    }

    .splitter-story__conversation {
        flex: 1 1 auto;
        padding: var(${standardPadding.cssCustomProperty});
        line-height: 1.5;
    }

    .splitter-story ${textAreaTag} {
        box-sizing: border-box;
        width: calc(100% - 32px);
        margin: 16px;
    }

    @media (max-width: 520px) {
        .splitter-story {
            display: block;
            height: auto;
        }

        .splitter-story ${fvSplitterTag} {
            display: none;
        }

        .splitter-story__secondary {
            min-height: 320px;
        }
    }
`;

function updateLayout(event: Event): void {
    const splitter = event.currentTarget as FvSplitter;
    const layout = splitter.parentElement;
    if (layout) {
        layout.style.gridTemplateColumns = `${splitter.position}fr 2px ${100 - splitter.position}fr`;
    }
}

function constrainPosition(position: number, min: number, max: number): number {
    const validMin = Number.isFinite(min) ? Math.min(100, Math.max(0, min)) : 0;
    const validMax = Math.max(
        validMin,
        Number.isFinite(max) ? Math.min(100, Math.max(0, max)) : 100
    );
    const finitePosition = Number.isFinite(position) ? position : 60;
    return Math.min(validMax, Math.max(validMin, finitePosition));
}

function getGridTemplateColumns(args: SplitterArgs): string {
    const position = constrainPosition(args.position, args.min, args.max);
    return `${position}fr 2px ${100 - position}fr`;
}

function updateTableData(args: SplitterArgs): void {
    void (async () => {
        await customElements.whenDefined(tableTag);
        await args.tableRef.setData(systems);
    })();
}

const metadata: Meta<SplitterArgs> = {
    title: 'Ok/Fv Splitter',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['input', 'change']
        }
    },
    render: createUserSelectedThemeStory(html<SplitterArgs>`
        ${okWarning({
            componentName: 'Fv Splitter',
            statusLink: './?path=/docs/component-status--docs#ok-components'
        })}
        <style class="code-hide">${storyStyles}</style>
        <div
            class="splitter-story"
            style="grid-template-columns: ${x => getGridTemplateColumns(x)}"
        >
            <main id="splitter-story-primary-pane" class="splitter-story__primary">
                <div class="splitter-story__toolbar">
                    <h2>Systems</h2>
                    <span>24 connected</span>
                </div>
                <${tableTag}
                    ${ref('tableRef')}
                    data-unused="${x => x.updateTableData(x)}"
                >
                    <${tableColumnTextTag} field-name="name">Name</${tableColumnTextTag}>
                    <${tableColumnTextTag} field-name="status">Status</${tableColumnTextTag}>
                    <${tableColumnTextTag} field-name="location">Location</${tableColumnTextTag}>
                </${tableTag}>
            </main>
            <${fvSplitterTag}
                position="${x => x.position}"
                min="${x => x.min}"
                max="${x => x.max}"
                step="${x => x.step}"
                aria-label="Resize system details pane"
                aria-controls="splitter-story-primary-pane"
                @input="${(_x, c) => updateLayout(c.event)}"
            ></${fvSplitterTag}>
            <aside class="splitter-story__secondary" aria-label="System details">
                <header><strong>System details</strong></header>
                <div class="splitter-story__conversation">
                    <p>Select a system to inspect its configuration and recent activity.</p>
                </div>
                <${textAreaTag} placeholder="Add a note" rows="3">Notes</${textAreaTag}>
            </aside>
        </div>
    `),
    argTypes: {
        position: {
            description: 'The primary pane width as a percentage of the containing layout.',
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        min: {
            description: 'The minimum allowed position.',
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        max: {
            description: 'The maximum allowed position.',
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        step: {
            description: 'The percentage-point increment used for keyboard resizing.',
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        input: {
            description: 'Emitted continuously when the position changes.',
            control: false,
            table: { category: apiCategory.events }
        },
        change: {
            description: 'Emitted when a pointer or keyboard resize is committed.',
            control: false,
            table: { category: apiCategory.events }
        },
        tableRef: {
            table: { disable: true }
        },
        updateTableData: {
            table: { disable: true }
        }
    },
    args: {
        position: 60,
        min: 25,
        max: 75,
        step: 1,
        tableRef: undefined,
        updateTableData
    }
};

export default metadata;

export const splitter: StoryObj<SplitterArgs> = {};