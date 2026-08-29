import { html, ref } from '@ni/fast-element';
import type { Slider } from '.';

export const template = html<Slider>`
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
                <div part="track-start" class="track-start" style="${x => x.position}">
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
                style="${x => x.position}"
            >
                <slot name="thumb"></slot>
                <span ${ref('valueLabel')} class="value-label" aria-hidden="true"></span>
            </div>
        </div>
    </template>
`;
