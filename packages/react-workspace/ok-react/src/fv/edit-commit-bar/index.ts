'use client';

import { FvEditCommitBar, fvEditCommitBarTag } from '@ni/ok-components/dist/esm/fv/edit-commit-bar';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvEditCommitBarTag };
export { type FvEditCommitBar, type CommitMessage } from '@ni/ok-components/dist/esm/fv/edit-commit-bar';
export const OkFvEditCommitBar = wrap(FvEditCommitBar, {
    events: {
        onSave: 'save' as EventName,
        onRevert: 'revert' as EventName,
        onDismissMessage: 'dismiss-message' as EventName
    }
});
