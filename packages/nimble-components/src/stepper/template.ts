import { html, slotted } from '@ni/fast-element';
import type { Stepper } from '.';

export const template = html<Stepper>`<ol><slot
        name="step"
        ${slotted('steps')}
    ></slot></ol>`;
