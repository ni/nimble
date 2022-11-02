import { attr, html, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableCell } from '../table-cell';
import type { IColumnProvider } from './column-provider';
import { BaseColumn } from './base-column';

/**
 * A provider for number cell content for a table
 */
export class NumberFieldColumn extends BaseColumn implements IColumnProvider {
    @attr
    public step?: number;

    public getColumnTemplate(): ViewTemplate<unknown, TableCell> {
        return html<TableCell, TableCell>`
            <nimble-number-field value=${x => x.cellData} step=${_ => this.step}>
            </nimble-number-field>
        `;
    }
}

const nimbleNumberFieldColumn = NumberFieldColumn.compose({
    baseName: 'number-field-column'
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberFieldColumn());