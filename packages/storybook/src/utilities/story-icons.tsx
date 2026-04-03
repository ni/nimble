import React from 'react';
import { type IconCheck, iconCheckTag } from '@ni/nimble-components/dist/esm/icons/check';
import { type IconExclamationMark, iconExclamationMarkTag } from '@ni/nimble-components/dist/esm/icons/exclamation-mark';
import { type IconKey, iconKeyTag } from '@ni/nimble-components/dist/esm/icons/key';

type NimbleIconProps = React.HTMLAttributes<HTMLElement> & {
    slot?: string;
    severity?: string;
};

function renderIcon(tagName: string, props: NimbleIconProps): React.JSX.Element {
    return React.createElement(tagName, props);
}

export function NimbleIconCheck(props: NimbleIconProps): React.JSX.Element {
    return renderIcon(iconCheckTag, props);
}

export function NimbleIconExclamationMark(props: NimbleIconProps): React.JSX.Element {
    return renderIcon(iconExclamationMarkTag, props);
}

export function NimbleIconKey(props: NimbleIconProps): React.JSX.Element {
    return renderIcon(iconKeyTag, props);
}

export type { IconCheck, IconExclamationMark, IconKey };