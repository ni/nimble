import { attr } from '@ni/fast-element';
import {
    DesignSystem,
    Slider as FoundationSlider,
    type SliderOptions
} from '@ni/fast-foundation';
import { Orientation } from '@ni/fast-web-utilities';
import { styles } from './styles';
import { template } from './template';
import { ThSliderShowMinMax } from './types';

export { ThSliderShowMinMax };

interface FoundationSliderInternals {
    calculateNewValue: (rawValue: number) => number;
    convertToConstrainedValue: (value: number) => number;
}

declare global {
    interface HTMLElementTagNameMap {
        'ok-th-slider': ThSlider;
    }
}

/**
 * A Nimble-styled slider control.
 */
export class ThSlider extends FoundationSlider {
    /**
     * Whether the current value is displayed next to the thumb.
     */
    @attr({ attribute: 'value-visible', mode: 'boolean' })
    public valueVisible = false;

    /**
     * Controls when the minimum and maximum value labels are displayed.
     */
    @attr({ attribute: 'show-min-max' })
    public showMinMax: ThSliderShowMinMax = ThSliderShowMinMax.hover;

    /** @internal */
    public valueLabel?: HTMLSpanElement;

    private verticalMappingInitialized = false;

    /** @internal */
    public override connectedCallback(): void {
        super.connectedCallback();

        if (!this.verticalMappingInitialized) {
            const internals = this as unknown as FoundationSliderInternals;
            const calculateFoundationValue = internals.calculateNewValue;
            internals.calculateNewValue = rawValue => calculateFoundationValue(
                this.orientation === Orientation.vertical
                    ? this.trackMinHeight + this.trackHeight - rawValue
                    : rawValue
            );
            this.verticalMappingInitialized = true;
        }

        this.updateValueLabel();
    }

    /** @internal */
    public override valueChanged(previous: string, next: string): void {
        super.valueChanged(previous, next);
        this.updateValueLabel();
    }

    /** @internal */
    public override increment(): void {
        if (this.orientation !== Orientation.vertical) {
            super.increment();
            return;
        }

        this.setVerticalValue(Number(this.value) + Number(this.step));
    }

    /** @internal */
    public override decrement(): void {
        if (this.orientation !== Orientation.vertical) {
            super.decrement();
            return;
        }

        this.setVerticalValue(Number(this.value) - Number(this.step));
    }

    private setVerticalValue(value: number): void {
        const internals = this as unknown as FoundationSliderInternals;
        const constrainedValue = internals.convertToConstrainedValue(value);
        this.value = `${Math.min(this.max, Math.max(this.min, constrainedValue))}`;
    }

    private updateValueLabel(): void {
        if (this.valueLabel) {
            this.valueLabel.textContent = this.value;
        }
    }
}

const okThSlider = ThSlider.compose<SliderOptions>({
    baseName: 'th-slider',
    baseClass: FoundationSlider,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okThSlider());
export const thSliderTag = 'ok-th-slider';
