import {
    html,
    ref,
    repeat,
    when,
    observable,
    type ViewTemplate
} from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { switchTag } from '@ni/nimble-components/dist/esm/switch';
import { checkboxTag } from '@ni/nimble-components/dist/esm/checkbox';
import { Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import type { TableRecord } from '@ni/nimble-components/dist/esm/table/types';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { createUserSelectedThemeStory } from '../../utilities/storybook';

interface GroupingPollingRecord extends TableRecord {
    id: string;
    groupA: string;
    groupB: string;
    dummy1: string;
    dummy2: string;
    dummy3: string;
}

const GROUP_A_VALUES = ['Group A1', 'Group A2', 'Group A3'];
const GROUP_B_VALUES = ['Group B1', 'Group B2'];
const ROWS_PER_GROUP = 3;
const POLL_INTERVAL_MS = 3000;
const MAX_CUSTOM_COLUMNS = 4;

function createInitialData(): GroupingPollingRecord[] {
    const records: GroupingPollingRecord[] = [];
    let index = 0;

    for (const groupA of GROUP_A_VALUES) {
        for (const groupB of GROUP_B_VALUES) {
            for (let row = 0; row < ROWS_PER_GROUP; row++) {
                index += 1;
                records.push({
                    id: `record-${index}`,
                    groupA,
                    groupB,
                    dummy1: `Dummy 1 - ${index}`,
                    dummy2: `Dummy 2 - ${index}`,
                    dummy3: `Dummy 3 - ${index}`
                });
            }
        }
    }

    return records;
}

/**
 * Repro for a plain nimble-table whose row groups appear to automatically re-expand
 * whenever the underlying data is refreshed via `setData()`, such as when polling
 * adds/updates custom-property-style columns. New custom columns are only added to
 * the table as hidden columns until toggled visible, matching how an application might
 * progressively discover custom properties and keep them hidden until a user opts in.
 */
class GroupingPollingRepro {
    @observable public declare customColumnIds: string[];
    @observable public declare visibleCustomColumnIds: Set<string>;
    @observable public declare pollingEnabled: boolean;
    @observable public declare pollCount: number;

    public table!: Table<GroupingPollingRecord>;

    private data: GroupingPollingRecord[] = createInitialData();
    private pollHandle?: number;

    public constructor() {
        this.customColumnIds = [];
        this.visibleCustomColumnIds = new Set<string>();
        this.pollingEnabled = false;
        this.pollCount = 0;
    }

    public async initialize(): Promise<void> {
        await customElements.whenDefined(tableTag);
        await this.applyData();
    }

    public destroy(): void {
        this.stopPolling();
    }

    public togglePolling(): void {
        if (this.pollingEnabled) {
            this.stopPolling();
        } else {
            this.startPolling();
        }
    }

    public addCustomColumnNow(): void {
        this.addCustomColumn();
        void this.applyData();
    }

    public updateValuesNow(): void {
        this.updateCustomColumnValues();
        void this.applyData();
    }

    public isCustomColumnVisible(columnId: string): boolean {
        return this.visibleCustomColumnIds.has(columnId);
    }

    public toggleCustomColumnVisibility(columnId: string): void {
        const updated = new Set(this.visibleCustomColumnIds);
        if (updated.has(columnId)) {
            updated.delete(columnId);
        } else {
            updated.add(columnId);
        }
        this.visibleCustomColumnIds = updated;
    }

    private startPolling(): void {
        this.pollingEnabled = true;
        this.pollHandle = window.setInterval(() => this.poll(), POLL_INTERVAL_MS);
    }

    private stopPolling(): void {
        this.pollingEnabled = false;
        if (this.pollHandle !== undefined) {
            window.clearInterval(this.pollHandle);
            this.pollHandle = undefined;
        }
    }

    private poll(): void {
        this.pollCount += 1;

        // Every other poll, simulate discovering a new custom property (which adds a new,
        // initially-hidden column). Otherwise, simulate a live refresh of the existing
        // custom property values.
        if (
            this.customColumnIds.length < MAX_CUSTOM_COLUMNS
            && this.pollCount % 2 === 1
        ) {
            this.addCustomColumn();
        } else {
            this.updateCustomColumnValues();
        }

        void this.applyData();
    }

    private addCustomColumn(): void {
        const columnId = `customProperty${this.customColumnIds.length + 1}`;
        this.customColumnIds = [...this.customColumnIds, columnId];
        this.data = this.data.map(record => ({
            ...record,
            [columnId]: this.randomValue()
        }));
    }

    private updateCustomColumnValues(): void {
        if (this.customColumnIds.length === 0) {
            return;
        }

        const columnToUpdate = this.customColumnIds[
            Math.floor(Math.random() * this.customColumnIds.length)
        ]!;
        this.data = this.data.map(record => ({
            ...record,
            [columnToUpdate]: this.randomValue()
        }));
    }

    private async applyData(): Promise<void> {
        await this.table.setData([...this.data]);
    }

    private randomValue(): string {
        return `value-${Math.floor(Math.random() * 1000)}`;
    }
}

const columnCheckboxTemplate: ViewTemplate<string, GroupingPollingRepro> = html<
    string,
    GroupingPollingRepro
>`
    <${checkboxTag}
        ?checked="${(x, c) => c.parent.isCustomColumnVisible(x)}"
        @change="${(x, c) => {
            c.parent.toggleCustomColumnVisibility(x);
            return true;
        }}"
    >
        ${x => x}
    </${checkboxTag}>
`;

const customColumnTemplate: ViewTemplate<string, GroupingPollingRepro> = html<
    string,
    GroupingPollingRepro
>`
    <${tableColumnTextTag}
        column-id="${x => x}"
        field-name="${x => x}"
        ?column-hidden="${(x, c) => !c.parent.isCustomColumnVisible(x)}"
    >
        ${x => x}
    </${tableColumnTextTag}>
`;

const template = html<GroupingPollingRepro>`
    <style class="code-hide">
        .grouping-polling-repro {
            display: flex;
            flex-direction: column;
            height: calc(100vh - 32px);
            min-height: 480px;
            gap: 12px;
        }
        .grouping-polling-repro .controls {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }
        .grouping-polling-repro .available-columns {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
        }
        .grouping-polling-repro .table-container {
            flex: 1;
            min-height: 0;
            position: relative;
        }
        .grouping-polling-repro ${tableTag} {
            height: 100%;
        }
    </style>
    <div class="grouping-polling-repro">
        <p>
            Collapse one or more groups using the row group chevrons (or the "collapse all" button in
            the table's top-left corner), then start polling or trigger an update using the buttons
            below. Check whether the collapsed groups automatically re-expand when <code>setData()</code>
            is called again, including when the update only adds or changes a <em>hidden</em> column.
        </p>
        <div class="controls">
            <${switchTag}
                ?checked="${x => x.pollingEnabled}"
                @change="${x => {
                    x.togglePolling();
                    return true;
                }}"
            >
                <span slot="checked-message">Polling</span>
                <span slot="unchecked-message">Polling</span>
                Fake polling
            </${switchTag}>
            <${buttonTag} @click="${x => {
                x.addCustomColumnNow();
                return true;
            }}">
                Add custom column now
            </${buttonTag}>
            <${buttonTag} @click="${x => {
                x.updateValuesNow();
                return true;
            }}">
                Update custom values now
            </${buttonTag}>
            <span>Poll count: ${x => x.pollCount}</span>
            <span>Custom columns: ${x => x.customColumnIds.length}</span>
        </div>
        ${when(x => x.customColumnIds.length > 0, html<GroupingPollingRepro>`
            <div class="available-columns">
                <span>Visible custom property columns:</span>
                ${repeat(x => x.customColumnIds, columnCheckboxTemplate)}
            </div>
        `)}
        <div class="table-container">
            <${tableTag} ${ref('table')} id-field-name="id">
                <${tableColumnTextTag} column-id="groupA" field-name="groupA" group-index="0" column-hidden>
                    Group A
                </${tableColumnTextTag}>
                <${tableColumnTextTag} column-id="groupB" field-name="groupB" group-index="1" column-hidden>
                    Group B
                </${tableColumnTextTag}>
                <${tableColumnTextTag} column-id="dummy1" field-name="dummy1">
                    Dummy column 1
                </${tableColumnTextTag}>
                <${tableColumnTextTag} column-id="dummy2" field-name="dummy2">
                    Dummy column 2
                </${tableColumnTextTag}>
                <${tableColumnTextTag} column-id="dummy3" field-name="dummy3">
                    Dummy column 3
                </${tableColumnTextTag}>
                ${repeat(x => x.customColumnIds, customColumnTemplate)}
            </${tableTag}>
        </div>
    </div>
`;

const repros = new WeakMap<Element, GroupingPollingRepro>();

const metadata: Meta = {
    title: 'Tests/Table',
    parameters: { layout: 'fullscreen' },
    render: (_args, context) => {
        const repro = new GroupingPollingRepro();
        const content = createUserSelectedThemeStory(template)(repro, context);
        repros.set(content, repro);
        return content;
    },
    play: ({ canvasElement }) => {
        void repros.get(canvasElement.firstElementChild!)!.initialize();
    }
};

export default metadata;

export const tableGroupingPollingRepro: StoryObj = {};
