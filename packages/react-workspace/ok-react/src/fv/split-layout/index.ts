'use client';

import { FvSplitLayout, fvSplitLayoutTag } from '@ni/ok-components/dist/esm/fv/split-layout';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvSplitLayoutTag };
export { type FvSplitLayout };
export const OkFvSplitLayout = wrap(FvSplitLayout, {
    events: {
        onInput: 'input' as EventName,
        onChange: 'change' as EventName
    }
});
