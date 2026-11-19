/// <reference lib="es2017.intl" />

'use client';

import { FvDateTimePicker, fvDateTimePickerTag } from '@ni/ok-components/dist/esm/fv/date-time-picker';
import { FvDateTimePickerAppearance, FvDateTimePickerType } from '@ni/ok-components/dist/esm/fv/date-time-picker/types';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvDateTimePickerTag, FvDateTimePickerAppearance, FvDateTimePickerType };
export { type FvDateTimePicker };
export const OkFvDateTimePicker = wrap(FvDateTimePicker, {
    events: {
        onInput: 'input' as EventName<FvDateTimePickerInputEvent>,
        onChange: 'change' as EventName<FvDateTimePickerChangeEvent>
    }
});
export interface FvDateTimePickerInputEvent extends Event {
    target: FvDateTimePicker;
}
export interface FvDateTimePickerChangeEvent extends Event {
    target: FvDateTimePicker;
}
