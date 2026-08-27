import React from 'react';
import {
    applicationBackgroundColor,
    bodyFontColor,
    tagFillColor,
    cardBorderColor,
    dividerWidth,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import anatomySvg from './images/button-anatomy.svg?raw';

const anatomySvgContent = anatomySvg.slice(
    anatomySvg.indexOf('>') + 1,
    anatomySvg.lastIndexOf('</svg>')
);

const anatomyStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: `var(${standardPadding.cssCustomProperty})`,
    paddingBottom: `var(${standardPadding.cssCustomProperty})`,
    alignItems: 'stretch',
    width: '100%',
    '--button-anatomy-background-color': `var(${applicationBackgroundColor.cssCustomProperty})`,
    '--button-anatomy-body-color': `var(${bodyFontColor.cssCustomProperty})`,
    '--button-anatomy-tag-color': `var(${tagFillColor.cssCustomProperty})`,
    '--button-anatomy-accent-color': `var(${bodyFontColor.cssCustomProperty})`
} as React.CSSProperties;

const controlWindowStyle = {
    position: 'relative',
    display: 'block',
    width: '100%',
    height: '180px',
    border: `var(${dividerWidth.cssCustomProperty}) solid var(${cardBorderColor.cssCustomProperty})`,
    borderRadius: '4px',
    overflow: 'hidden',
    background: 'var(--button-anatomy-background-color)'
} as React.CSSProperties;

const controlStyle = {
    position: 'absolute',
    top: '70px',
    left: 'calc(50% - 96px)',
    display: 'block',
    width: '151px',
    height: '85px',
    fill: 'none'
} as React.CSSProperties;

const legendStyle = {
    display: 'block',
    width: '91px',
    height: '65px',
    marginLeft: `var(${standardPadding.cssCustomProperty})`,
    fill: 'none'
} as React.CSSProperties;

interface ButtonAnatomyProps {
    alt: string;
}

export const ButtonAnatomy = ({ alt }: ButtonAnatomyProps): React.JSX.Element => {
    return <div aria-label={alt} role='img' style={anatomyStyle}>
        <div style={controlWindowStyle}>
            <svg
                aria-hidden='true'
                viewBox='248 120 151 85'
                xmlns='http://www.w3.org/2000/svg'
                style={controlStyle}
                dangerouslySetInnerHTML={{ __html: anatomySvgContent }}
            />
        </div>
        <svg
            aria-hidden='true'
            viewBox='54 260 91 65'
            xmlns='http://www.w3.org/2000/svg'
            style={legendStyle}
            dangerouslySetInnerHTML={{ __html: anatomySvgContent }}
        />
    </div>;
};
