import React from 'react';
import {
    applicationBackgroundColor,
    bodyFontColor,
    buttonAccentBlockFontColor,
    tagFillColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import anatomySvg from './images/button-anatomy.svg?raw';

const anatomySvgStyle = {
    display: 'block',
    maxWidth: '100%',
    paddingBottom: '16px',
    '--button-anatomy-background-color': `var(${applicationBackgroundColor.cssCustomProperty})`,
    '--button-anatomy-body-color': `var(${bodyFontColor.cssCustomProperty})`,
    '--button-anatomy-tag-color': `var(${tagFillColor.cssCustomProperty})`,
    '--button-anatomy-accent-color': `var(${buttonAccentBlockFontColor.cssCustomProperty})`
} as React.CSSProperties;

interface ButtonAnatomyProps {
    alt: string;
}

export const ButtonAnatomy = ({ alt }: ButtonAnatomyProps): React.JSX.Element => {
    return <div
        aria-label={alt}
        role='img'
        style={anatomySvgStyle}
        dangerouslySetInnerHTML={{ __html: anatomySvg }}
    />;
};
