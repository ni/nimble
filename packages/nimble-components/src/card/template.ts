import { html } from '@microsoft/fast-element';
import type { Card } from '.';

export const template = html<Card>`
    <section aria-labelledby="title-slot">
        <slot name="title" id="title-slot"></slot>
        <slot></slot>
    </section>
`;
