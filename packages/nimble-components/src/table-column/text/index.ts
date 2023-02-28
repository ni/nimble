import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { fractionalWidthColumn } from '../extensions/fractional-width-column';
import { TableColumnTextMixin } from './table-column-text-mixin';

/**
 * The table column for displaying strings.
 */
// prettier-ignore
export class TableColumnText extends fractionalWidthColumn(TableColumnTextMixin) {}

const nimbleTableColumnText = TableColumnText.compose({
    baseName: 'table-column-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnText());
