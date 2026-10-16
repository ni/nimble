import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, ref, repeat, when } from '@ni/fast-element';
import { textFieldTag } from '@ni/nimble-components/dist/esm/text-field';
import { textAreaTag } from '@ni/nimble-components/dist/esm/text-area';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { checkboxTag } from '@ni/nimble-components/dist/esm/checkbox';
import { tableTag } from '@ni/nimble-components/dist/esm/table';
import type { TableRowSelectionEventDetail } from '@ni/nimble-components/dist/esm/table/types';
import { tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { tableColumnMappingTag } from '@ni/nimble-components/dist/esm/table-column/mapping';
import { mappingIconTag } from '@ni/nimble-components/dist/esm/mapping/icon';
import { mappingEmptyTag } from '@ni/nimble-components/dist/esm/mapping/empty';
import { iconCircleFilledTag } from '@ni/nimble-components/dist/esm/icons/circle-filled';
import { iconArrowLeftTwoRectanglesTag } from '@ni/nimble-components/dist/esm/icons/arrow-left-two-rectangles';
import { iconArrowRightTwoRectanglesTag } from '@ni/nimble-components/dist/esm/icons/arrow-right-two-rectangles';
import { iconArrowPartialRotateLeftTag } from '@ni/nimble-components/dist/esm/icons/arrow-partial-rotate-left';
import { iconFloppyDiskTag } from '@ni/nimble-components/dist/esm/icons/floppy-disk';
import { iconEyeTag } from '@ni/nimble-components/dist/esm/icons/eye';
import { iconPencilTag } from '@ni/nimble-components/dist/esm/icons/pencil';
import { tabsTag } from '@ni/nimble-components/dist/esm/tabs';
import { tabTag } from '@ni/nimble-components/dist/esm/tab';
import { tabPanelTag } from '@ni/nimble-components/dist/esm/tab-panel';
import { dialogTag } from '@ni/nimble-components/dist/esm/dialog';
import { labelProviderCoreTag } from '@ni/nimble-components/dist/esm/label-provider/core';
import { labelProviderTableTag } from '@ni/nimble-components/dist/esm/label-provider/table';
import { fvBulkEditFieldTag } from '@ni/ok-components/dist/esm/fv/bulk-edit-field';
import { fvEditCommitBarTag } from '@ni/ok-components/dist/esm/fv/edit-commit-bar';
import { fvSplitLayoutTag } from '@ni/ok-components/dist/esm/fv/split-layout';
import { fvSearchInputTag } from '@ni/ok-components/dist/esm/fv/search-input';
import { bodyFont, bodyFontColor, applicationBackgroundColor, dividerBackgroundColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { createUserSelectedThemeStory } from '../../../utilities/storybook';
import { AssetInventory, type FieldDefinition } from './asset-inventory';

const fieldTemplate = html<FieldDefinition, AssetInventory>`
    <${fvBulkEditFieldTag}
        label="${x => x.label}"
        status="${(x, c) => c.parent.status(x.key)}"
        ?reset-disabled="${(x, c) => !c.parent.state.field(x.key).pending}"
        @reset="${(x, c) => c.parent.reset(x.key)}"
        @clear="${(x, c) => c.parent.clear(x.key)}"
    >
        ${when(
            x => x.options !== undefined,
            html<FieldDefinition, AssetInventory>`
                <${selectTag}
                    data-field="${x => x.key}"
                    :value="${(x, c) => c.parent.state.field(x.key).value}"
                    @change="${(x, c) => c.parent.edit(x.key, c.event)}"
                >
                    <${listOptionTag} value="">Leave unchanged</${listOptionTag}>
                    ${repeat(x => x.options!, html<string>`<${listOptionTag} value="${x => x}">${x => x}</${listOptionTag}>`)}
                </${selectTag}>
            `,
            html<FieldDefinition, AssetInventory>`
                ${when(
                    x => x.key === 'notes',
                    html<FieldDefinition, AssetInventory>`
                        <${textAreaTag}
                            data-field="${x => x.key}"
                            :value="${(x, c) => c.parent.state.field(x.key).value}"
                            @input="${(x, c) => c.parent.edit(x.key, c.event)}"
                            rows="4"
                        ></${textAreaTag}>
                    `,
                    html<FieldDefinition, AssetInventory>`
                        <${textFieldTag}
                            data-field="${x => x.key}"
                            :value="${(x, c) => c.parent.state.field(x.key).value}"
                            placeholder="${(x, c) => (c.parent.state.field(x.key).mixed ? 'Enter a value to overwrite all' : 'Leave unchanged')}"
                            @input="${(x, c) => c.parent.edit(x.key, c.event)}"
                        ></${textFieldTag}>
                    `
                )}
            `
        )}
    </${fvBulkEditFieldTag}>
`;

const template = html<AssetInventory>`
    <style>
        .bulk-edit-example {
            display: flex; flex-direction: column; width: 100%; height: calc(100vh - 32px);
            min-height: 480px; font: var(${bodyFont.cssCustomProperty}); color: var(${bodyFontColor.cssCustomProperty});
            background: var(${applicationBackgroundColor.cssCustomProperty});
        }
        .bulk-edit-example h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .bulk-edit-example .page-heading { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; padding: 16px; }
        .bulk-edit-example .top-toolbar { flex: 1; display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 8px; }
        .bulk-edit-example .demo-actions { display: flex; align-items: center; gap: 8px; margin-inline-end: auto; }
        .bulk-edit-example .top-toolbar [hidden] { display: none; }
        .bulk-edit-example ${fvSplitLayoutTag} { flex: 1; min-height: 0; }
        .bulk-edit-example .table-pane { display: flex; flex-direction: column; }
        .bulk-edit-example .table-tools { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 8px; border-block: 1px solid var(${dividerBackgroundColor.cssCustomProperty}); }
        .bulk-edit-example .table-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 8px; margin-inline-start: auto; max-width: 100%; }
        .bulk-edit-example .table-actions ${fvSearchInputTag} { flex: 1 1 176px; min-width: 80px; }
        .bulk-edit-example .status-filter::part(label) { display: none; }
        .bulk-edit-example .table-body { display: flex; flex: 1; min-height: 0; position: relative; }
        .bulk-edit-example ${tableTag} { flex: 1; min-height: 0; width: 100%; height: auto; }
        .bulk-edit-example .table-footer { display: flex; flex-wrap: wrap; justify-content: space-between; padding: 8px 16px; border-block-start: 1px solid var(${dividerBackgroundColor.cssCustomProperty}); }
        .bulk-edit-example .empty { display: grid; align-content: center; text-align: center; padding: 24px; min-height: 200px; }
        .bulk-edit-example [hidden] { display: none; }
        .bulk-edit-example .no-records { position: absolute; inset: 48px 0 0; background: var(${applicationBackgroundColor.cssCustomProperty}); }
        .bulk-edit-example .fields { display: grid; gap: 24px; padding: 24px 16px; }
        .bulk-edit-example .view-fields { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0; margin: 0; padding: 8px 16px; }
        .bulk-edit-example .view-field { display: grid; grid-template-columns: minmax(90px, 1fr) minmax(0, 2fr); gap: 16px; padding: 12px 0; border-block-end: 1px solid var(${dividerBackgroundColor.cssCustomProperty}); }
        .bulk-edit-example .view-field dt { font-weight: 600; }
        .bulk-edit-example .view-field dd { margin: 0; overflow-wrap: anywhere; }
        .bulk-edit-example ${tabsTag} { margin: 4px 8px 0; }
        .bulk-edit-example ${tabPanelTag} { padding: 0; }
        .bulk-edit-example ${dialogTag}::part(control) { width: min(480px, 90vw); }
    </style>
    <div class="bulk-edit-example">
        <${labelProviderCoreTag}></${labelProviderCoreTag}>
        <${labelProviderTableTag}></${labelProviderTableTag}>
        <header class="page-heading">
            <h1>Assets <small>120</small></h1>
            <div class="top-toolbar" role="toolbar" aria-label="Asset actions">
                <div class="demo-actions">
                    <span>Demo only:</span>
                    <${checkboxTag}
                        :checked="${x => x.failNextSave}"
                        @change="${(x, c) => {
                            x.failNextSave = (c.event.target as HTMLInputElement).checked; return true;
                        }}"
                    >Fail next save</${checkboxTag}>
                </div>
                <${buttonTag} appearance="ghost" ?disabled="${x => x.state.selectedIds.length === 0}" @click="${x => {
                    void x.select([]); return true;
                }}">Deselect all</${buttonTag}>
                ${when<AssetInventory>(x => x.editMode, html<AssetInventory>`
                    <${buttonTag} appearance="ghost" ?disabled="${x => x.changeCount === 0 || x.busy}" @click="${x => x.revert()}">
                        <${iconArrowPartialRotateLeftTag} slot="start"></${iconArrowPartialRotateLeftTag}>Revert
                    </${buttonTag}>
                    <${buttonTag} appearance="block" appearance-variant="accent" ?disabled="${x => x.changeCount === 0 || x.busy}" @click="${x => {
                        void x.save(); return true;
                    }}>
                        <${iconFloppyDiskTag} slot="start"></${iconFloppyDiskTag}>Save
                    </${buttonTag}>
                `)}
            </div>
        </header>
        <${fvSplitLayoutTag} :collapsed="${x => x.collapsed}" position="60">
            <section slot="primary" class="table-pane" aria-label="Asset records">
                <div class="table-tools" role="toolbar" aria-label="Asset table tools">
                    <div class="table-actions">
                        <${fvSearchInputTag} appearance="underline" aria-label="Search assets" placeholder="Search items..." :value="${x => x.search}" @input="${(x, c) => x.filter(c.event)}"></${fvSearchInputTag}>
                        <${selectTag} class="status-filter" :value="${x => x.statusFilter}" @change="${(x, c) => x.filter(c.event, true)}">
                            Filter by status
                            <${listOptionTag} value="">All statuses</${listOptionTag}>
                            <${listOptionTag} value="Available">Available</${listOptionTag}>
                            <${listOptionTag} value="In use">In use</${listOptionTag}>
                            <${listOptionTag} value="Maintenance">Maintenance</${listOptionTag}>
                        </${selectTag}>
                        <${buttonTag}
                            appearance="ghost"
                            content-hidden
                            aria-expanded="${x => !x.collapsed}"
                            aria-label="${x => (x.collapsed ? 'Expand edit pane' : 'Collapse edit pane')}"
                            title="${x => (x.collapsed ? 'Expand edit pane' : 'Collapse edit pane')}"
                            @click="${x => {
                                x.collapsed = !x.collapsed; return true;
                            }}">
                            ${when(x => x.collapsed, html`
                                <${iconArrowLeftTwoRectanglesTag} slot="start"></${iconArrowLeftTwoRectanglesTag}>
                            `, html`
                                <${iconArrowRightTwoRectanglesTag} slot="start"></${iconArrowRightTwoRectanglesTag}>
                            `)}
                        </${buttonTag}>
                    </div>
                </div>
                <div class="table-body">
                    <${tableTag} ${ref('table')} id-field-name="id" selection-mode="multiple"
                        aria-label="Asset inventory" @selection-change="${(x, c) => x.onSelection(c.event as CustomEvent<TableRowSelectionEventDetail>)}"
                    >
                        <${tableColumnMappingTag} field-name="hasChanges" column-id="pending" key-type="boolean" width-mode="icon-size" sorting-disabled>
                            <${iconCircleFilledTag} title="Unsaved changes" aria-label="Unsaved changes"></${iconCircleFilledTag}>
                            <${mappingIconTag} key="true" icon="${iconCircleFilledTag}" severity="information" text="Unsaved changes" text-hidden></${mappingIconTag}>
                            <${mappingEmptyTag} key="false" text="No pending changes"></${mappingEmptyTag}>
                        </${tableColumnMappingTag}>
                        <${tableColumnTextTag} field-name="name" column-id="name" fractional-width="2">Name</${tableColumnTextTag}>
                        <${tableColumnTextTag} field-name="status" column-id="status">Status</${tableColumnTextTag}>
                        <${tableColumnTextTag} field-name="location" column-id="location">Location</${tableColumnTextTag}>
                        <${tableColumnTextTag} field-name="workspace" column-id="workspace">Workspace</${tableColumnTextTag}>
                        <${tableColumnTextTag} field-name="model" column-id="model">Model</${tableColumnTextTag}>
                    </${tableTag}>
                    ${when(x => x.visibleRecords.length === 0, html`<div class="empty no-records">No records match the filters.</div>`)}
                </div>
                <footer class="table-footer"><span>${x => x.visibleRecords.length} records</span><span>${x => x.affectedCount} pending</span></footer>
            </section>
            <section slot="secondary" aria-label="Edit selected assets">
                <${fvEditCommitBarTag}
                    actions-hidden
                    ?hide-empty-summary="${x => !x.editMode}"
                    heading="${x => `${x.editMode ? 'Edit' : 'View'}${x.state.selectedIds.length > 0 ? ` — ${x.state.selectedIds.length} ${x.state.selectedIds.length === 1 ? 'row' : 'rows'}` : ''}`}"
                    :changeCount="${x => x.changeCount}"
                    :affectedRowCount="${x => x.affectedCount}"
                    :hiddenAffectedRowCount="${x => x.hiddenAffectedCount}"
                    :message="${x => x.message}"
                    @dismiss-message="${x => {
                        x.message = undefined; return true;
                    }}"
                >
                    <${buttonTag}
                        slot="heading-actions"
                        appearance="ghost"
                        content-hidden
                        aria-label="${x => (x.editMode ? 'View selected assets' : 'Edit selected assets')}"
                        title="${x => (x.editMode ? 'View selected assets' : 'Edit selected assets')}"
                        @click="${x => x.toggleMode()}"
                    >
                        ${when(x => x.editMode, html`<${iconEyeTag} slot="start"></${iconEyeTag}>`, html`<${iconPencilTag} slot="start"></${iconPencilTag}>`)}
                    </${buttonTag}>
                </${fvEditCommitBarTag}>
                <div ?hidden="${x => x.state.selectedIds.length > 0}" class="empty">Select one or more rows to edit.</div>
                <${tabsTag} ?hidden="${x => x.state.selectedIds.length === 0 || !x.editMode}" activeid="bulk-general-tab">
                    <${tabTag} id="bulk-general-tab">General</${tabTag}>
                    <${tabTag} id="bulk-properties-tab">Properties</${tabTag}>
                    <${tabPanelTag}><div class="fields">${repeat(x => x.fields.filter(field => field.section === 'General'), fieldTemplate)}</div></${tabPanelTag}>
                    <${tabPanelTag}><div class="fields">${repeat(x => x.fields.filter(field => field.section === 'Properties'), fieldTemplate)}</div></${tabPanelTag}>
                </${tabsTag}>
                ${when<AssetInventory>(x => x.state.selectedIds.length > 0 && !x.editMode, html<AssetInventory>`
                    <dl class="view-fields" aria-label="Selected asset details">
                        ${repeat(x => x.fields, html<FieldDefinition, AssetInventory>`
                            <div class="view-field">
                                <dt>${x => x.label}</dt>
                                <dd>${(x, c) => c.parent.viewValue(x.key)}</dd>
                            </div>
                        `)}
                    </dl>
                `)}
            </section>
        </${fvSplitLayoutTag}>
        <${dialogTag} ${ref('dialog')}>
            <span slot="title">Discard unsaved changes?</span>
            Changing the selection discards pending edits.
            <${buttonTag} slot="footer" appearance="ghost" @click="${x => x.dialog.close(false)}">Keep editing</${buttonTag}>
            <${buttonTag} slot="footer" appearance="outline" @click="${x => x.dialog.close(true)}">Discard changes</${buttonTag}>
        </${dialogTag}>
    </div>
`;

const inventories = new WeakMap<Element, AssetInventory>();

const metadata: Meta = {
    title: 'Ok/Patterns/Split Pane Bulk Edit',
    parameters: { layout: 'fullscreen' },
    render: (_args, context) => {
        const inventory = new AssetInventory();
        const content = createUserSelectedThemeStory(template)(inventory, context);
        inventories.set(content, inventory);
        return content;
    },
    play: ({ canvasElement }) => inventories.get(canvasElement.firstElementChild!)!.initialize()
};

export default metadata;
export const splitPaneBulkEdit: StoryObj = {};
