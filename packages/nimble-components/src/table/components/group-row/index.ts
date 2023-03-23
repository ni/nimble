import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-group-row': TableGroupRow;
    }
}

/**
 * A styled cell that is used within the nimble-table-row.
 * @internal
 */
export class TableGroupRow extends FoundationElement {
    @observable
    public groupRowValue?: unknown;

    @observable
    public nestingLevel = 0;

    @observable
    public leafItemCount?: number;

    @observable
    public columnConfig?: unknown;

    @attr({ mode: 'boolean' })
    public expanded = false;

    @observable
    public groupHeaderViewTag?: string;

    /**
     * @internal
     */
    public readonly expandIcon!: HTMLElement;

    /**
     * @internal
     */
    @observable
    public animationClass = '';

    public onGroupExpandToggle(): void {
        this.$emit('group-expand-toggle');
        this.animationClass = 'animating';
        this.expandIcon.addEventListener(
            'transitionend',
            this.removeAnimatingClass
        );
    }

    private readonly removeAnimatingClass = (): void => {
        this.animationClass = '';
        this.expandIcon.removeEventListener(
            'transitionend',
            this.removeAnimatingClass
        );
    };
}

const nimbleTableGroupRow = TableGroupRow.compose({
    baseName: 'table-group-row',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTableGroupRow());
export const tableGroupRowTag = DesignSystem.tagFor(TableGroupRow);
