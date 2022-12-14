import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-header': TableHeader;
    }
}

/**
 * A styled header that is used within the nimble-table.
 */
export class TableHeader extends FoundationElement {
}

const nimbleTableHeader = TableHeader.compose({
    baseName: 'table-header',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableHeader());
