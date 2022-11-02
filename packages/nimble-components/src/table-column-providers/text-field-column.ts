import { html, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableCell } from '../table-cell';
import type { IColumnProvider } from './column-provider';
import { BaseColumn } from './base-column';

/**
 * A provider for string cell content for a table
 */
export class TextFieldColumn extends BaseColumn implements IColumnProvider {
    public getColumnTemplate(): ViewTemplate<unknown, TableCell> {
        return html<TableCell, TableCell>`
            <nimble-text-field appearance="frameless" readonly="true" value=${x => x.cellData}>
            </nimble-text-field>
        `;
    }
}

const nimbleTextFieldColumn = TextFieldColumn.compose({
    baseName: 'text-field-column'
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTextFieldColumn());