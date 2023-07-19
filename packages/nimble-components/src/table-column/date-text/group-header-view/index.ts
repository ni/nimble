import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableNumberFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';
import type { TableColumnDateTextColumnConfig } from '..';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-date-text-group-header': TableColumnDateTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying date/time fields as text.
 */
export class TableColumnDateTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableNumberFieldValue,
TableColumnDateTextColumnConfig
> {
    private columnConfigChanged(): void {
        this.placeholder = this.columnConfig?.placeholder ?? '';
    }

    private groupHeaderValueChanged(): void {
        if (typeof this.groupHeaderValue === 'number') {
            const formatter = new Intl.DateTimeFormat(undefined, {
                dateStyle: 'medium',
                timeStyle: 'medium'
            });
            this.text = formatter
                .format(this.groupHeaderValue)
                .replace('\u202f', ' '); // on Chrome, the space before AM/PM is a narrow non-breaking space. For testing consistency across browsers, replace it with a regular space.
            this.shouldUsePlaceholder = false;
        } else {
            this.text = '';
            this.shouldUsePlaceholder = true;
        }
    }
}

const tableColumnDateTextGroupHeaderView = TableColumnDateTextGroupHeaderView.compose({
    baseName: 'table-column-date-text-group-header',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnDateTextGroupHeaderView());
export const tableColumnDateTextGroupHeaderTag = DesignSystem.tagFor(
    TableColumnDateTextGroupHeaderView
);
