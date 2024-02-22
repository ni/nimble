import { html } from '@microsoft/fast-element';
import type { Card } from '.';

export const template = html<Card>`
    <section aria-labelledby="title-slot">
        <span id="title-slot"><slot name="title"></slot></span>
        <slot></slot>
    </section>
`;
