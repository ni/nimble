import React from 'react';
import {
    applicationBackgroundColor,
    bodyFontColor,
    tagFillColor,
    cardBorderColor,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import anatomySvg from './images/button-anatomy.svg?raw';

const anatomyStyle = {
    paddingBottom: `var(${standardPadding.cssCustomProperty})`,
    width: '100%',
    '--button-anatomy-background-color': `var(${applicationBackgroundColor.cssCustomProperty})`,
    '--button-anatomy-body-color': `var(${bodyFontColor.cssCustomProperty})`,
    '--button-anatomy-tag-color': `var(${tagFillColor.cssCustomProperty})`,
    '--button-anatomy-accent-color': `var(${bodyFontColor.cssCustomProperty})`,
    '--button-anatomy-border-color': `var(${cardBorderColor.cssCustomProperty})`
} as React.CSSProperties;

interface ButtonAnatomyProps {
    alt: string;
}

export const ButtonAnatomy = ({ alt }: ButtonAnatomyProps): React.JSX.Element => {
    return <div aria-label={alt} role='img' style={anatomyStyle}>
        <div aria-hidden='true' dangerouslySetInnerHTML={{ __html: anatomySvg }} />
    </div>;
};
