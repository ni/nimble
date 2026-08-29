import { attr } from '@ni/fast-element';
import {
    DesignSystem,
    Slider as FoundationSlider,
    type SliderOptions
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-th-slider': Slider;
    }
}

/**
 * A Nimble-styled slider control.
 */
export class Slider extends FoundationSlider {
    /**
     * Whether the current value is displayed next to the thumb.
     */
    @attr({ attribute: 'value-visible', mode: 'boolean' })
    public valueVisible = false;

    /** @internal */
    public valueLabel?: HTMLSpanElement;

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateValueLabel();
    }

    /** @internal */
    public override valueChanged(previous: string, next: string): void {
        super.valueChanged(previous, next);
        this.updateValueLabel();
    }

    private updateValueLabel(): void {
        if (this.valueLabel) {
            this.valueLabel.textContent = this.value;
        }
    }
}

const okThSlider = Slider.compose<SliderOptions>({
    baseName: 'th-slider',
    baseClass: FoundationSlider,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okThSlider());
export const sliderTag = 'ok-th-slider';
