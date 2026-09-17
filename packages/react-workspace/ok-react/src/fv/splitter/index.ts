'use client';

import { FvSplitter, fvSplitterTag } from '@ni/ok-components/dist/esm/fv/splitter';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvSplitterTag };
export { type FvSplitter };
export const OkFvSplitter = wrap(FvSplitter, {
    events: {
        onInput: 'input' as EventName<FvSplitterInputEvent>,
        onChange: 'change' as EventName<FvSplitterChangeEvent>,
    }
});
export interface FvSplitterInputEvent extends Event {
    target: FvSplitter;
}
export interface FvSplitterChangeEvent extends Event {
    target: FvSplitter;
}