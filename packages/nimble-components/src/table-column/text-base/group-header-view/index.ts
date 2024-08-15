import type { DesignTokenSubscriber } from '@microsoft/fast-foundation';
import { observable } from '@microsoft/fast-element';
import { TableGroupHeaderView } from '../../base/group-header-view';
import type { TableFieldValue } from '../../../table/types';
import {
    tableGroupRowPlaceholderEmptyLabel,
    tableGroupRowPlaceholderNoValueLabel
} from '../../../label-provider/table/label-tokens';

/**
 * The group header view base class for displaying fields of any type as text.
 */
export abstract class TableColumnTextGroupHeaderViewBase<
    TGroupValue = TableFieldValue,
    TColumnConfig = unknown
> extends TableGroupHeaderView<TGroupValue, TColumnConfig> {
    /** @internal */
    @observable
    public hasOverflow = false;

    /**
     * Text to render in the cell.
     *
     * The value is initialized to `tableGroupRowPlaceholderNoValue` because if the group
     * row never has a value defined on it, the change handlers may never get called but
     * the text needs to be correct.
     */
    @observable
    public text = tableGroupRowPlaceholderNoValueLabel.getValueFor(this);

    private readonly noValuePlaceholderLabelSubscriber: DesignTokenSubscriber<
        typeof tableGroupRowPlaceholderNoValueLabel
    > = {
            handleChange: () => {
                this.applyPlaceholderTextIfNeeded();
            }
        };

    private readonly emptyPlaceholderLabelSubscriber: DesignTokenSubscriber<
        typeof tableGroupRowPlaceholderEmptyLabel
    > = {
            handleChange: () => {
                this.applyPlaceholderTextIfNeeded();
            }
        };

    public override connectedCallback(): void {
        super.connectedCallback();
        tableGroupRowPlaceholderNoValueLabel.subscribe(
            this.noValuePlaceholderLabelSubscriber,
            this
        );
        tableGroupRowPlaceholderEmptyLabel.subscribe(
            this.emptyPlaceholderLabelSubscriber,
            this
        );
        this.applyPlaceholderTextIfNeeded();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        tableGroupRowPlaceholderNoValueLabel.unsubscribe(
            this.noValuePlaceholderLabelSubscriber
        );
        tableGroupRowPlaceholderEmptyLabel.unsubscribe(
            this.emptyPlaceholderLabelSubscriber
        );
    }

    protected abstract updateText(): void;

    private columnConfigChanged(): void {
        if (!this.applyPlaceholderTextIfNeeded()) {
            this.updateText();
        }
    }

    private groupHeaderValueChanged(): void {
        if (!this.applyPlaceholderTextIfNeeded()) {
            this.updateText();
        }
    }

    /**
     * Sets `this.text` to the appropriate placeholder if `groupHeaderValue` warrants it.
     * @returns `true` if `this.text` was set to a placeholder, `false` otherwise.
     */
    private applyPlaceholderTextIfNeeded(): boolean {
        if (
            this.groupHeaderValue === null
            || this.groupHeaderValue === undefined
        ) {
            this.text = tableGroupRowPlaceholderNoValueLabel.getValueFor(this);
            return true;
        }
        if (this.groupHeaderValue === '') {
            this.text = tableGroupRowPlaceholderEmptyLabel.getValueFor(this);
            return true;
        }
        return false;
    }
}
