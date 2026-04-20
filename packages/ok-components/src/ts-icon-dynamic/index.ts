/* eslint-disable max-classes-per-file */
import { DesignSystem } from '@ni/fast-foundation';
import { html, css } from '@ni/fast-element';
import { Icon } from '@ni/nimble-components/dist/esm/icon-base';
import { styles } from './styles';
import { template } from './template';
import { display } from '../utilities/style/display';

declare global {
    interface HTMLElementTagNameMap {
        'ok-ts-icon-dynamic': TsIconDynamic;
    }
}

/**
 * Base class for dynamic icons. Not intended to be used directly, instead use to register dynamic icons:
 * ```
 * customElements.get('ok-ts-icon-dynamic').registerIconDynamic('ok-ts-icon-dynamic-awesome', '<img data uri or arbitrary url>');
 * ```
 * After calling successfully, the icon can be used like any other icon:
 * ```
 * <ok-ts-icon-dynamic-awesome></ok-ts-icon-dynamic-awesome>
 * <nimble-mapping-icon icon="ok-ts-icon-dynamic-awesome"></nimble-mapping-icon>
 * ```
 */
export class TsIconDynamic extends Icon {
    public constructor(/** @internal */ public readonly url: string) {
        super();
    }

    public static registerIconDynamic(tagName: string, url: string): void {
        const tagPrefix = 'ok-ts-icon-dynamic-';
        if (!tagName.startsWith(tagPrefix)) {
            throw new Error(`Icon tag name must start with '${tagPrefix}', provided name: ${tagName}`);
        }
        const name = tagName.substring(tagPrefix.length);
        if (!/^[a-z][a-z]+$/.test(name)) {
            throw new Error(`Icon name must be lowercase [a-z] and at least two characters long, provided name: ${name}`);
        }
        const iconClassName = `TsIconDynamic${name.charAt(0).toUpperCase() + name.slice(1)}`;
        const iconClassContainer = {
            // Class name for expression should come object literal assignment, helpful for stack traces, etc.
            [iconClassName]: class extends TsIconDynamic {
                constructor() {
                    super(url);
                }
            }
        } as const;
        const iconClass = iconClassContainer[iconClassName]!;
        const baseName = `ts-icon-dynamic-${name}`;
        const composedIcon = iconClass.compose({
            baseName,
            template,
            styles
        });

        DesignSystem.getOrCreate().withPrefix('ok').register(composedIcon());
    }
}

const okTsIconDynamic = TsIconDynamic.compose({
    baseName: 'ts-icon-dynamic',
    template: html`<template></template>`,
    styles: css`${display('none')}`
});

DesignSystem.getOrCreate().withPrefix('ok').register(okTsIconDynamic());
export const tsIconDynamicTag = 'ok-ts-icon-dynamic';
