/* eslint-disable max-classes-per-file */
import { DesignSystem } from '@ni/fast-foundation';
import { html, css } from '@ni/fast-element';
import { Icon } from '@ni/nimble-components/dist/esm/icon-base';
import { styles } from './styles';
import { template } from './template';
import { display } from '../utilities/style/display';

declare global {
    interface HTMLElementTagNameMap {
        'ok-icon-dynamic': IconDynamic;
    }
}

/**
 * Base class for dynamic icons. Not intended to be used directly, instead use to register dynamic icons:
 * ```
 * customElements.get('ok-icon-dynamic').registerIconDynamic('awesome', '<url>');
 * ```
 * After called successfully, the icon can be used:
 * ```
 * <ok-icon-dynamic-awesome></ok-icon-dynamic-awesome>
 * ```
 */
export class IconDynamic extends Icon {
    public constructor(/** @internal */ public readonly url: string) {
        super();
    }

    public static registerIconDynamic(name: string, url: string): void {
        if (!/^[a-z][a-z]+$/.test(name)) {
            throw new Error(`Icon name must be lowercase [a-z] and at least two characters long, provided name: ${name}`);
        }
        const iconClassName = `IconDynamic${name.charAt(0).toUpperCase() + name.slice(1)}`;
        const iconClassContainer = {
            // Class name for expression should come object literal assignment, helpful for stack traces, etc.
            [iconClassName]: class extends Icon {
                public readonly url = url;
            }
        } as const;
        const iconClass = iconClassContainer[iconClassName]!;
        const baseName = `icon-dynamic-${name}`;
        const composedIcon = iconClass.compose({
            baseName,
            template,
            styles
        });

        DesignSystem.getOrCreate().withPrefix('ok').register(composedIcon());
    }
}

const okIconDynamic = IconDynamic.compose({
    baseName: 'icon-dynamic',
    template: html`<template></template>`,
    styles: css`${display('none')}`
});

DesignSystem.getOrCreate().withPrefix('ok').register(okIconDynamic());
export const iconDynamicTag = 'ok-icon-dynamic';
