'use client';

import { FvTextField, fvTextFieldTag } from '@ni/ok-components/dist/esm/fv/text-field';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvTextFieldTag };
export { type FvTextField, type MaskitoOptions } from '@ni/ok-components/dist/esm/fv/text-field';
export const OkFvTextField = wrap(FvTextField, {
    events: {
        onInput: 'input' as EventName,
        onChange: 'change' as EventName
    }
});
