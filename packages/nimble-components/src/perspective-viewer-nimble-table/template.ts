import { html, ref, repeat, ViewTemplate } from '@microsoft/fast-element';
import type { FoundationElementTemplate } from '@microsoft/fast-foundation';
import type { PerspectiveViewerNimbleTable } from '.';
import type { Table } from '../table';
import { TableRow, VirtualTableRowData } from '../table-row';

export const template: FoundationElementTemplate<ViewTemplate<PerspectiveViewerNimbleTable>> = context => html<PerspectiveViewerNimbleTable>`
<template>
    <div class="table-viewport" ${ref('viewport')}>
        <div class="table-body" ${ref('rowContainer')} style="height: ${x => x.rowContainerHeight}px">
        ${repeat(x => x.rowData, html<VirtualTableRowData>`
            <span class="foo"
                    style="
                        height: ${x => x.size}px;
                        position: absolute;
                        margin-top: ${x => x.start}px;
                        ">
                <span class="group-row-content">
                    <${context.tagFor(TableRow)} :rowData="${x => x}">
                    </${context.tagFor(TableRow)}>                                
                </span>
            </span>
        `)}
        </div>
    </div>
</template>
`;
