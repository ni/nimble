import { html } from '@microsoft/fast-element';
import type { Accordion } from '.';

export const template = html<Accordion>`
    <section role="region" aria-labelledby="title-slot">
        <slot name="title" id="title-slot"></slot>
        <slot></slot>
    </section>
`;
