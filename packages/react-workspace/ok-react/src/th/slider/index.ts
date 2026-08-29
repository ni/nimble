'use client';

import {
    Slider,
    sliderTag
} from '@ni/ok-components/dist/esm/th/slider';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { sliderTag };
export { type Slider };
export const OkThSlider = wrap(Slider, {
    events: {
        onChange: 'change' as EventName<SliderChangeEvent>
    }
});
export interface SliderChangeEvent extends CustomEvent {
    target: Slider;
}
