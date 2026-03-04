import { html } from '@ni/fast-element';
import type { Stepper } from '.';
import { devicePixelRatio } from '../utilities/models/device-pixel-ratio';

export const template = html<Stepper>`
    <style>:host{--ni-private-device-resolution: ${() => devicePixelRatio.current};}</style>
    <slot name="step"></slot>
`;
