import {
    attr,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { TableColumnSortDirection } from '../../table/types';
import {
    ColumnInternals,
    ColumnInternalsOptions
} from './models/column-internals';
import type { TableColumnValidity } from './types';
import type { ColumnValidator } from './models/column-validator';

type ColumnValidatorConstructor<T extends ColumnValidator<[]>> = abstract new (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
) => T;

/**
 * The base class for table columns
 */
export abstract class TableColumn<
    TColumnConfig = unknown
> extends FoundationElement {
    /**
     * @internal
     *
     * Column properties configurable by plugin authors
     */
    public readonly columnInternals: ColumnInternals<TColumnConfig> = new ColumnInternals(this.getColumnInternalsOptions());

    @attr({ attribute: 'column-id' })
    public columnId?: string;

    @attr({ attribute: 'action-menu-slot' })
    public actionMenuSlot?: string;

    @attr({ attribute: 'action-menu-label' })
    public actionMenuLabel?: string;

    @attr({ attribute: 'column-hidden', mode: 'boolean' })
    public columnHidden = false;

    @attr({ attribute: 'sort-index', converter: nullableNumberConverter })
    public sortIndex?: number | null;

    @attr({ attribute: 'sort-direction' })
    public sortDirection: TableColumnSortDirection = TableColumnSortDirection.none;

    @attr({ attribute: 'sorting-disabled', mode: 'boolean' })
    public sortingDisabled = false;

    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public contentSlot!: HTMLSlotElement;

    public checkValidity(): boolean {
        return this.columnInternals.validator.isValid();
    }

    public get validity(): TableColumnValidity {
        return this.columnInternals.validator.getValidity();
    }

    /** @internal */
    public get headerTextContent(): string {
        return this.contentSlot
            .assignedNodes()
            .map(node => node.textContent?.trim())
            .join(' ');
    }

    public override connectedCallback(): void {
        super.connectedCallback();

        // Done here to enforce consistency across headers as they may have custom templates
        this.setAttribute('slot', this.columnInternals.uniqueId);
    }

    protected abstract getColumnInternalsOptions(): ColumnInternalsOptions;

    protected sortDirectionChanged(): void {
        if (!this.sortingDisabled) {
            this.columnInternals.currentSortDirection = this.sortDirection;
        }
    }

    protected sortIndexChanged(): void {
        if (!this.sortingDisabled) {
            this.columnInternals.currentSortIndex = this.sortIndex;
        }
    }

    protected sortingDisabledChanged(): void {
        if (this.sortingDisabled) {
            this.columnInternals.currentSortDirection = TableColumnSortDirection.none;
            this.columnInternals.currentSortIndex = undefined;
        } else {
            this.columnInternals.currentSortDirection = this.sortDirection;
            this.columnInternals.currentSortIndex = this.sortIndex;
        }
    }

    protected getTypedValidator<T extends ColumnValidator<[]>>(
        requiredType: ColumnValidatorConstructor<T>
    ): T {
        if (this.columnInternals.validator instanceof requiredType) {
            return this.columnInternals.validator;
        }

        throw new Error('Unexpected column validator type found');
    }
}
