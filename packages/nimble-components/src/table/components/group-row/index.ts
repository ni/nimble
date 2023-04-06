import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { TableColumn } from '../../../table-column/base';
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
    public groupColumn?: TableColumn;

    @attr({ mode: 'boolean' })
    public expanded = false;

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
        // To avoid a visual glitch with improper expand/collapse icons performing an
        // animation, we apply a class to the appropriate group row such that we can have
        // a more targeted CSS animation. We use the 'transitionend' event to remove the
        // temporary class and register a function reference as the handler to avoid issues
        // that may result from the 'transitionend' event not firing, as it will never result
        // in multiple event listeners being registered.
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
