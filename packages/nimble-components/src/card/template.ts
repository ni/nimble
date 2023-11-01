import { html } from '@microsoft/fast-element';
import type { Card } from '.';

export const template = html<Card>`
    <section aria-labelledby="titleSlot">
        <slot name="title" id="titleSlot"></slot>
        <slot></slot>
    </section>
`;
