import { DesignSystem } from '@microsoft/fast-foundation';
import { styles } from '../base/styles';
import { template } from '../base/template';
import { fractionalWidthColumn } from '../extensions/fractional-width-column';
import { TableColumnTextBase } from './table-column-text-base';

/**
 * The table column for displaying strings.
 */
export class TableColumnText extends fractionalWidthColumn(TableColumnTextBase) {}

const nimbleTableColumnText = TableColumnText.compose({
    baseName: 'table-column-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnText());
