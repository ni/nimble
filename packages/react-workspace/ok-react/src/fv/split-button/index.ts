'use client';

import { FvSplitButton, fvSplitButtonTag } from '@ni/ok-components/dist/esm/fv/split-button';
import {
    FvSplitButtonAppearance,
    FvSplitButtonAppearanceVariant
} from '@ni/ok-components/dist/esm/fv/split-button/types';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvSplitButtonTag };
export {
    type FvSplitButton,
    FvSplitButtonAppearance,
    FvSplitButtonAppearanceVariant
};
export const OkFvSplitButton = wrap(FvSplitButton, {
    events: {
        onTrigger: 'trigger' as EventName<FvSplitButtonTriggerEvent>,
        onToggle: 'toggle' as EventName<FvSplitButtonToggleEvent>,
    }
});
export interface FvSplitButtonTriggerEvent extends CustomEvent {
    target: FvSplitButton;
}
export interface FvSplitButtonToggleEvent extends CustomEvent<{ open: boolean }> {
    target: FvSplitButton;
}