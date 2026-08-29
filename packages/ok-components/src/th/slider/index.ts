import {
    DesignSystem,
    Slider as FoundationSlider,
    sliderTemplate as template,
    type SliderOptions
} from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'ok-th-slider': Slider;
    }
}

/**
 * A Nimble-styled slider control.
 */
export class Slider extends FoundationSlider {}

const okThSlider = Slider.compose<SliderOptions>({
    baseName: 'th-slider',
    baseClass: FoundationSlider,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okThSlider());
export const sliderTag = 'ok-th-slider';
