import React from 'react';
import { tokenValues } from '@ni/nimble-components/dist/esm/theme-provider/design-token-values';
import type { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { standardPadding } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import anatomySvg from './images/button-anatomy.svg?raw';

const anatomyStyle = (theme: Theme): React.CSSProperties => ({
    paddingBottom: `var(${standardPadding.cssCustomProperty})`,
    width: '100%',
    '--button-anatomy-background-color': tokenValues.applicationBackgroundColor[theme],
    '--button-anatomy-body-color': tokenValues.bodyFontColor[theme],
    '--button-anatomy-tag-color': tokenValues.tagFillColor[theme],
    '--button-anatomy-accent-color': tokenValues.bodyFontColor[theme],
    '--button-anatomy-border-color': tokenValues.cardBorderColor[theme]
} as React.CSSProperties);

interface ButtonAnatomyProps {
    alt: string;
    theme: Theme;
}

export const ButtonAnatomy = ({ alt, theme }: ButtonAnatomyProps): React.JSX.Element => {
    return <div aria-label={alt} role='img' style={anatomyStyle(theme)}>
        <div aria-hidden='true' dangerouslySetInnerHTML={{ __html: anatomySvg }} />
    </div>;
};
