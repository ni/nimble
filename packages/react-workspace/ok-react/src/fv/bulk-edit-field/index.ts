'use client';

import { FvBulkEditField, fvBulkEditFieldTag } from '@ni/ok-components/dist/esm/fv/bulk-edit-field';
import { BulkEditFieldStatus } from '@ni/ok-components/dist/esm/fv/bulk-edit-field/types';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvBulkEditFieldTag, BulkEditFieldStatus };
export { type FvBulkEditField };
export const OkFvBulkEditField = wrap(FvBulkEditField, {
    events: {
        onReset: 'reset' as EventName,
        onClear: 'clear' as EventName
    }
});
