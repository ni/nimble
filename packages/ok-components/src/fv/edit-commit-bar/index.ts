import { attr, nullableNumberConverter, observable, volatile } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import type { BannerToggleEventDetail } from '@ni/nimble-components/dist/esm/banner/types';
import { styles } from './styles';
import { template } from './template';
import type { CommitMessage } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-edit-commit-bar': FvEditCommitBar;
    }
}

/**
 * Heading, pending-change summary, actions, and feedback for an edit pane.
 */
export class FvEditCommitBar extends FoundationElement {
    @attr
    public heading = '';

    @attr({ attribute: 'change-count', converter: nullableNumberConverter })
    public changeCount = 0;

    @attr({ attribute: 'affected-row-count', converter: nullableNumberConverter })
    public affectedRowCount = 0;

    @attr({ attribute: 'hidden-affected-row-count', converter: nullableNumberConverter })
    public hiddenAffectedRowCount = 0;

    @attr({ attribute: 'save-disabled', mode: 'boolean' })
    public saveDisabled = false;

    @attr({ attribute: 'revert-disabled', mode: 'boolean' })
    public revertDisabled = false;

    @attr({ attribute: 'actions-hidden', mode: 'boolean' })
    public actionsHidden = false;

    @attr({ attribute: 'hide-empty-summary', mode: 'boolean' })
    public hideEmptySummary = false;

    @observable
    public message: CommitMessage | undefined;

    /** @internal */
    @volatile
    public get summary(): string {
        if (this.changeCount === 0) {
            return 'No pending changes';
        }
        const changes = `${this.changeCount} unsaved ${this.changeCount === 1 ? 'change' : 'changes'}`;
        const rows = `${this.affectedRowCount} ${this.affectedRowCount === 1 ? 'row' : 'rows'}`;
        const hidden = this.hiddenAffectedRowCount > 0
            ? ` (${this.hiddenAffectedRowCount} hidden)`
            : '';
        return `${changes} in ${rows}${hidden}`;
    }

    /** @internal */
    public save(): boolean {
        if (!this.saveDisabled) {
            this.$emit('save');
        }
        return true;
    }

    /** @internal */
    public revert(): boolean {
        if (!this.revertDisabled) {
            this.$emit('revert');
        }
        return true;
    }

    /** @internal */
    public handleBannerToggle(event: CustomEvent<BannerToggleEventDetail>): boolean {
        if (!event.detail.newState) {
            this.$emit('dismiss-message');
        }
        return true;
    }
}

const okFvEditCommitBar = FvEditCommitBar.compose({
    baseName: 'fv-edit-commit-bar',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvEditCommitBar());
export const fvEditCommitBarTag = 'ok-fv-edit-commit-bar';
export type { CommitMessage };
