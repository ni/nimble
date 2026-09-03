import { html, ref } from '@ni/fast-element';
import { Orientation } from '@ni/fast-web-utilities';
import type { ThSlider } from '.';

const getPosition = (slider: ThSlider): string => (
    slider.orientation === Orientation.vertical
        ? (slider.position?.replace('bottom:', 'top:') ?? '')
        : slider.position
);

export const template = html<ThSlider>`
    <template
        role="slider"
        tabindex="${x => (x.disabled ? null : 0)}"
        aria-valuetext="${x => x.valueTextFormatter(x.value)}"
        aria-valuenow="${x => x.value}"
        aria-valuemin="${x => x.min}"
        aria-valuemax="${x => x.max}"
        aria-disabled="${x => (x.disabled ? true : undefined)}"
        aria-readonly="${x => (x.readOnly ? true : undefined)}"
        aria-orientation="${x => x.orientation}"
        class="${x => x.orientation}"
    >
        <div part="positioning-region" class="positioning-region">
            <div ${ref('track')} part="track-container" class="track">
                <slot name="track"></slot>
                <div part="track-start" class="track-start" style="${getPosition}">
                    <slot name="track-start"></slot>
                </div>
            </div>
            <span class="range-label minimum-label" aria-hidden="true">${x => x.min}</span>
            <span class="range-label maximum-label" aria-hidden="true">${x => x.max}</span>
            <slot></slot>
            <div
                ${ref('thumb')}
                part="thumb-container"
                class="thumb-container"
                style="${getPosition}"
            >
                <slot name="thumb"></slot>
            </div>
            <span
                ${ref('valueLabel')}
                class="value-label"
                style="${getPosition}"
                aria-hidden="true"
            ></span>
        </div>
    </template>
`;
