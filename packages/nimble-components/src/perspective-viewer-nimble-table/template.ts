import { html, ref, repeat, ViewTemplate } from '@microsoft/fast-element';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { PerspectiveViewerNimbleTable } from '.';
import { TableRow } from '../table-row';
import type { VirtualTableRowData } from '../table-row-data/virtual-table-row-data';

export const template: FoundationElementTemplate<ViewTemplate<PerspectiveViewerNimbleTable>> = context => html<PerspectiveViewerNimbleTable>`
<template>
    <div class="table-viewport" ${ref('viewport')}>
        <div class="table-body" ${ref('rowContainer')} style="height: ${x => x.rowContainerHeight}px">
        ${repeat(x => x.rowData1, html<VirtualTableRowData>`
            <span class="foo"
                    style="
                        height: ${x => x.size}px;
                        position: absolute;
                        margin-top: ${x => x.start}px;
                        ">
                <span class="group-row-content">
                    <${context.tagFor(TableRow)} :rowData="${x => x.rowData}">
                    </${context.tagFor(TableRow)}>                                
                </span>
            </span>
        `)}
        </div>
    </div>
</template>
`;
