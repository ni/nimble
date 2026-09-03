'use client';

import {
    ThSlider,
    thSliderTag
} from '@ni/ok-components/dist/esm/th/slider';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { thSliderTag };
export { type ThSlider };
export const OkThSlider = wrap(ThSlider, {
    events: {
        onChange: 'change' as EventName<ThSliderChangeEvent>
    }
});
export interface ThSliderChangeEvent extends CustomEvent {
    target: ThSlider;
}
