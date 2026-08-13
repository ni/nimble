'use client';

import {
    FvSplitButtonAnchor,
    fvSplitButtonAnchorTag
} from '@ni/ok-components/dist/esm/fv/split-button-anchor';
import {
    FvSplitButtonAnchorAppearance,
    FvSplitButtonAnchorAppearanceVariant
} from '@ni/ok-components/dist/esm/fv/split-button-anchor/types';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvSplitButtonAnchorTag };
export {
    type FvSplitButtonAnchor,
    FvSplitButtonAnchorAppearance,
    FvSplitButtonAnchorAppearanceVariant
};
export const OkFvSplitButtonAnchor = wrap(FvSplitButtonAnchor, {
    events: {
        onTrigger: 'trigger' as EventName<FvSplitButtonAnchorTriggerEvent>,
        onToggle: 'toggle' as EventName<FvSplitButtonAnchorToggleEvent>,
    }
});
export interface FvSplitButtonAnchorTriggerEvent extends CustomEvent<void> {
    target: FvSplitButtonAnchor;
}
export interface FvSplitButtonAnchorToggleEvent extends CustomEvent<{ open: boolean }> {
    target: FvSplitButtonAnchor;
}