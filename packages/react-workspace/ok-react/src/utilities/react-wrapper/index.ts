import type { EventName, Options, ReactWebComponent } from '@lit/react';
import { createComponent } from '@lit/react';
import React from 'react';

export { type EventName } from '@lit/react';
export interface EventNames {
    [key: string]: EventName | string;
}

type Constructor<T> = new () => T;
type Opts<
    I extends HTMLElement,
    E extends EventNames = NonNullable<unknown>
> = Omit<Options<I, E>, 'elementClass' | 'react' | 'tagName'>;

export function wrap<I extends HTMLElement, E extends EventNames = NonNullable<unknown>>(
    elementClass: Constructor<I>,
    options: Opts<I, E> = {},
): ReactWebComponent<I, E> {
    return createComponent<I, E>({
        ...options,
        elementClass,
        react: React,
        tagName: customElements.getName(elementClass)!
    });
}
