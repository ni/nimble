import { html, slotted } from '@ni/fast-element';
import type { Stepper } from '.';
import { devicePixelRatio } from '../utilities/models/device-pixel-ratio';

export const template = html<Stepper>`<ol><slot
        style="--ni-private-device-pixel-ratio: ${() => devicePixelRatio.current};"
        name="step"
        ${slotted('steps')}
    ></slot></ol>`;
