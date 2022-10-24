import { html, when, repeat, ViewTemplate, ref, slotted, elements } from '@microsoft/fast-element';
import type { ElementDefinitionContext, FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { Row } from '@tanstack/table-core';
import type { VirtualItem } from '@tanstack/virtual-core';
import type { Table, TableHeader } from '.';
import { TableRow } from '../table-row';

export const rowGroupTemplate = html<VirtualItem<Row<unknown>>, Table>`
    <span class="group-row-content"
    style="
        height: ${x => x.size}px;
        position: absolute;
        width: calc(100% - ${(x, c) => 16 * ((c.parent as Table).tableData[x.index]?.row.depth || 0)}px);
        margin-top: ${x => x.start}px;
        padding-left: ${(x, c) => 16 * ((c.parent as Table).tableData[x.index]?.row.depth || 0)}px;
        ">
        <nimble-button
            appearance="ghost"
            content-hidden
            @click=${(x, c) => (c.parent as Table).tableData[x.index]?.row.toggleExpanded()}>
            ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                <nimble-icon-arrow-expander-down slot="start"></nimble-icon-arrow-expander-down>
            `)}
            ${when((x, c) => !(c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                <nimble-icon-arrow-expander-right slot="start"></nimble-icon-arrow-expander-right>
            `)}
            Expand/Collapse
        </nimble-button>
        <!-- TODO: 'subrows' doesn't correctly account for sub groups. -->
        <span class="group-text">
            ${(x, c) => (c.parent as Table).tableData[x.index]?.row.groupingValue} (${(x, c) => (c.parent as Table).tableData[x.index]?.row.subRows.length})
        </span>
    </span>
`;

export const rowChildTemplate = html<VirtualItem<Row<unknown>>, Table>`
    <span id=${(x, c) => `row-${c.parent.tableData[x.index]?.row.id || ''}`} class="foo"
    style="
        position: absolute;
        width: calc(100% - ${(x, c) => 16 * (c.parent.tableData[x.index]?.row?.depth || 0)}px);
        margin-top: ${x => x.start}px;
        padding-left: ${(x, c) => 16 * (c.parent.tableData[x.index]?.row?.depth || 0)}px;
        ">
        <span class="group-row-content" style="height: 32px">
        ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getCanExpand(), html<VirtualItem<Row<unknown>>>`
            <nimble-button
                appearance="ghost"
                content-hidden
                @click=${(x, c) => (c.parent as Table).tableData[x.index]?.row.toggleExpanded()}>
                ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                    <nimble-icon-arrow-expander-down slot="start"></nimble-icon-arrow-expander-down>
                `)}
                ${when((x, c) => !(c.parent as Table).tableData[x.index]?.row.getIsExpanded(), html`
                    <nimble-icon-arrow-expander-right slot="start"></nimble-icon-arrow-expander-right>
                `)}
                Expand/Collapse
            </nimble-button>
        `)}
        <nimble-table-row :rowData="${(x, c) => c.parent.tableData[x.index]}">
            <slot name="${(x, c) => (c.parent.isActiveRow(x.index) ? 'actionMenu' : 'zzz')}" slot="rowActionMenu"></slot>
        </nimble-table-row>                                
        </span>
        <div style="margin-left: 40px">
        ${when((x, c) => (c.parent as Table).tableData[x.index]?.row.getIsExpanded() && (c.parent as Table).rowTemplate !== undefined, html<VirtualItem<Row<unknown>>>`
            ${(x, c) => (c.parent as Table).rowTemplate!(x.index)}
        `)}
        </div>
    </span>
`;

export const template: FoundationElementTemplate<ViewTemplate<Table>> = context => html<Table>`
<template>
    <!-- <span style="display: none;">
        <slot name="menu" ${slotted({ property: 'slottedActionMenus', filter: elements('[role=menu]') })}></slot>
        </slot>
    </span> -->
    <!-- <nimble-menu-button content-hidden appearance="block">
        <nimble-icon-key slot="start"></nimble-icon-key>
        <slot name="actionMenu" slot="menu"></slot>
        <nimble-menu slot="menu">
            <slot name="actionMenu" slot="menu"></slot>
            <slot name="actionMenuItem"></slot>
        </nimble-menu> 
    </nimble-menu-button>-->

    <div class="table-container" ${ref('tableContainer')}>
        <div class="table-header"> 
            ${repeat(x => x.tableHeaders, html<TableHeader>`
                <nimble-menu-button appearance="ghost">
                    ${when(x => x.column.getIsSorted() === 'asc', html`
                        <nimble-icon-arrow-expander-up slot="end"></nimble-icon-arrow-expander-up>
                    `)}
                    ${when(x => x.column.getIsSorted() === 'desc', html`
                        <nimble-icon-arrow-expander-down slot="end"></nimble-icon-arrow-expander-down>
                    `)}
                    ${when(x => x.column.getIsGrouped(), html`
                        <nimble-icon-hashtag slot="start"></nimble-icon-hashtag>
                    `)}
                    <span>${x => x.title}</span>

                    <nimble-menu slot="menu">
                        <nimble-menu-item @change=${x => { x.column.toggleSorting(); }}>Toggle sorting</nimble-menu-item>
                        <nimble-menu-item @change=${x => { x.column.toggleGrouping(); }}>Toggle grouping</nimble-menu-item>
                    </nimble-menu>
                </nimble-menu-button>
            `, { positioning: true })}
        </div>
        <div class="table-viewport" ${ref('viewport')}>
            <div class="table-body" ${ref('rowContainer')} style="height: ${x => x.rowContainerHeight}px">
            </div>
        </div>
    </div>
</template>
`;
