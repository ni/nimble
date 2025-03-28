import { attr, observable } from '@ni/fast-element';
import { FoundationElement } from '@ni/fast-foundation';
import {
    ColumnInternals,
    type ColumnInternalsOptions
} from './models/column-internals';
import type { TableColumnValidity } from './types';
import type { ColumnValidator } from './models/column-validator';
import { slotTextContent } from '../../utilities/models/slot-text-content';

/**
 * The base class for table columns
 */
export abstract class TableColumn<
    TColumnConfig = unknown,
    TColumnValidator extends ColumnValidator<[]> = ColumnValidator<[]>
> extends FoundationElement {
    /**
     * @internal
     *
     * Column properties configurable by plugin authors
     */
    public readonly columnInternals: ColumnInternals<
    TColumnConfig,
    TColumnValidator
    > = new ColumnInternals(this.getColumnInternalsOptions());

    @attr({ attribute: 'column-id' })
    public columnId?: string;

    @attr({ attribute: 'action-menu-slot' })
    public actionMenuSlot?: string;

    @attr({ attribute: 'action-menu-label' })
    public actionMenuLabel?: string;

    @attr({ attribute: 'column-hidden', mode: 'boolean' })
    public columnHidden = false;

    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public contentSlot!: HTMLSlotElement;

    public checkValidity(): boolean {
        return this.columnInternals.validator.isColumnValid;
    }

    public get validity(): TableColumnValidity {
        return this.columnInternals.validator.getValidity();
    }

    /** @internal */
    public get headerTextContent(): string {
        return slotTextContent(this.contentSlot);
    }

    public override connectedCallback(): void {
        super.connectedCallback();

        // Done here to enforce consistency across headers as they may have custom templates
        this.setAttribute('slot', this.columnInternals.uniqueId);
    }

    protected abstract getColumnInternalsOptions(): ColumnInternalsOptions<TColumnValidator>;
}
