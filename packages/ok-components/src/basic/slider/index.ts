import {
    DesignSystem,
    Slider as FoundationSlider,
    sliderTemplate as template,
    type SliderOptions
} from '@ni/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'ok-basic-slider': Slider;
    }
}

/**
 * A Nimble-styled slider control.
 */
export class Slider extends FoundationSlider {}

const okBasicSlider = Slider.compose<SliderOptions>({
    baseName: 'basic-slider',
    baseClass: FoundationSlider,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okBasicSlider());
export const sliderTag = 'ok-basic-slider';
