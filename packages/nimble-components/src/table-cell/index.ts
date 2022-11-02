import { attr, Observable, observable, ViewTemplate } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { template } from './template';

export interface CellData {
    columnId: string;
    value: unknown;
}

/**
 * rdfg
 */
export class TableCell extends FoundationElement {
    /**
     * The column index of the cell.
     * This will be applied to the css grid-column-index value
     * applied to the cell
     *
     * @public
     * @remarks
     * HTML Attribute: grid-column
     */
    @attr({ attribute: 'grid-column' })
    public gridColumn?: string;

    @observable
    public cellData?: unknown;

    @observable
    public cellItemTemplate?: ViewTemplate;

    @observable
    public hasMenu = false;

    private _cellData: unknown = null;
 
    public onMenuOpening(): void {
        this.$emit('action-menu-open');
    }
}

const nimbleTableCell = TableCell.compose({
    baseName: 'table-cell',
    template
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableCell());
