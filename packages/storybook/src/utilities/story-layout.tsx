import React, { type ReactNode } from 'react';
import { NimbleIconCheck } from '@ni/nimble-react/icons/check';
import { NimbleIconXmark } from '@ni/nimble-react/icons/xmark';
import {
    applicationBackgroundColor,
    bodyEmphasizedFont,
    bodyPlus1EmphasizedFont,
    bodyPlus1Font,
    buttonAccentBlockFontColor,
    cardBorderColor,
    dividerWidth,
    failColor,
    largePadding,
    mediumPadding,
    passColor,
    smallPadding,
    standardPadding,
    titlePlus1FontColor,
    iconColor,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

export const css = (strings: TemplateStringsArray, ...values: unknown[]): React.JSX.Element => <style>
    {`@scope {${String.raw({ raw: strings }, ...values)}}`}
</style>;

interface ChildrenProp {
    children?: ReactNode;
}

const getPreferredTheme = (): 'dark' | 'light' => (
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
);

export const theme = getPreferredTheme();

interface StoryAnatomyProps extends ChildrenProp {
    src?: string;
    alt: string;
    bordered?: boolean;
}

export const StoryAnatomy = ({ children, src, alt, bordered = true }: StoryAnatomyProps): React.JSX.Element => {
    return <figure>
        {css`
            :scope {
                margin: calc(var(${largePadding.cssCustomProperty}) + var(${mediumPadding.cssCustomProperty}) + var(${smallPadding.cssCustomProperty})) 0 calc(var(${largePadding.cssCustomProperty}) + var(${mediumPadding.cssCustomProperty}));
                border: ${bordered ? `var(${dividerWidth.cssCustomProperty}) solid var(${cardBorderColor.cssCustomProperty})` : '0'};
                border-radius: ${bordered ? '4px' : '0'};
                overflow: ${bordered ? 'hidden' : 'visible'};
                background: ${bordered ? `var(${applicationBackgroundColor.cssCustomProperty})` : 'transparent'};
            }
            :scope img {
                display: block;
                width: 100%;
                height: auto;
            }
            :scope > :not(style) {
                margin-inline: auto;
            }
        `}
        {children ?? (src ? <img src={src} alt={alt}/> : null)}
    </figure>;
};

export const StoryGuidance = ({ children }: ChildrenProp): React.JSX.Element => {
    return <div>
        {css`
            :scope {
                margin-top: calc(var(${largePadding.cssCustomProperty}) + var(${mediumPadding.cssCustomProperty}) + var(${smallPadding.cssCustomProperty}));
            }
            :scope > * + * {
                margin-top: calc(var(${largePadding.cssCustomProperty}) + var(${mediumPadding.cssCustomProperty}) + var(${smallPadding.cssCustomProperty}));
            }
        `}
        {children}
    </div>;
};

export const StoryGuidanceGrid = ({ children }: ChildrenProp): React.JSX.Element => {
    return <div>
        {css`
            :scope {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                align-items: start;
                gap: calc(var(${standardPadding.cssCustomProperty}) + var(${standardPadding.cssCustomProperty}));
                margin-top: var(${largePadding.cssCustomProperty});
            }
            @media (max-width: 640px) {
                :scope {
                    grid-template-columns: 1fr;
                    gap: calc(var(${largePadding.cssCustomProperty}) + var(${mediumPadding.cssCustomProperty}) + var(${smallPadding.cssCustomProperty}));
                }
            }
        `}
        {children}
    </div>;
};

interface StoryShowcaseProps extends ChildrenProp {
    example: ReactNode;
}

export const StoryShowcase = ({ children, example }: StoryShowcaseProps): React.JSX.Element => {
    return <div>
        {css`
            :scope {
                margin: 0 0 var(${largePadding.cssCustomProperty});
                overflow: hidden;
                border: var(${dividerWidth.cssCustomProperty}) solid var(${cardBorderColor.cssCustomProperty});
                border-radius: 4px;
                background: var(${applicationBackgroundColor.cssCustomProperty});
            }
            :scope .story-showcase-preview {
                display: flex;
                min-height: 148px;
                align-items: center;
                justify-content: center;
                gap: var(${standardPadding.cssCustomProperty});
                padding: var(${largePadding.cssCustomProperty});
                background: var(${applicationBackgroundColor.cssCustomProperty});
            }
            :scope .story-showcase-description {
                padding: var(${standardPadding.cssCustomProperty});
                border-top: var(${dividerWidth.cssCustomProperty}) solid var(${cardBorderColor.cssCustomProperty});
            }
            :scope .story-showcase-description > *:first-child {
                margin-top: 0;
            }
            :scope .story-showcase-description > *:last-child {
                margin-bottom: 0;
            }
            :scope .story-showcase-preview > * {
                margin: 0 !important;
            }
            @media (max-width: 640px) {
                :scope .story-showcase-preview {
                    min-height: 128px;
                    padding: var(${standardPadding.cssCustomProperty});
                }
            }
        `}
        <div className='story-showcase-preview'>{example}</div>
        {children ? <div className='story-showcase-description'>{children}</div> : null}
    </div>;
};

interface GuidanceProp extends ChildrenProp {
    example?: ReactNode;
    title: string;
}

const Guidance = (
    {
        children,
        example,
        title,
        label,
        icon,
        tone
    }: GuidanceProp & {
        label: string,
        icon: ReactNode,
        tone: 'do' | 'dont'
    }
): React.JSX.Element => {
    return <article className={`guidance-${tone}`}>
        {css`
            :scope {
                min-width: 0;
                font: var(${bodyPlus1Font.cssCustomProperty});
                line-height: 21px;
            }
            :scope > header {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 22px;
                gap: var(${mediumPadding.cssCustomProperty});
                padding: 0 var(${largePadding.cssCustomProperty});
                border-radius: 4px 4px 0 0;
                color: var(${buttonAccentBlockFontColor.cssCustomProperty});
                font: var(${bodyEmphasizedFont.cssCustomProperty});
                font-weight: 700;
                text-transform: uppercase;
            }
            :scope > header > span {
                font: inherit;
            }
            :scope.guidance-do > header {
                background: var(${passColor.cssCustomProperty});
            }
            :scope.guidance-dont > header {
                background: var(${failColor.cssCustomProperty});
            }
            :scope > header > *:first-child {
                ${iconColor.cssCustomProperty}: var(${buttonAccentBlockFontColor.cssCustomProperty});
            }
            :scope .guidance-example {
                box-sizing: border-box;
                display: flex;
                width: 100%;
                min-height: 202px;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-top: var(${smallPadding.cssCustomProperty});
                padding: var(${mediumPadding.cssCustomProperty});
                font: var(${bodyPlus1Font.cssCustomProperty});
                line-height: 21px;
            }
            :scope.guidance-do .guidance-example {
                background: color-mix(in srgb, var(${passColor.cssCustomProperty}) 7%, var(${applicationBackgroundColor.cssCustomProperty}));
            }
            :scope.guidance-dont .guidance-example {
                background: color-mix(in srgb, var(${failColor.cssCustomProperty}) 7%, var(${applicationBackgroundColor.cssCustomProperty}));
            }
            :scope .guidance-example-content {
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                min-height: 180px;
                align-items: center;
                justify-content: center;
                gap: var(${standardPadding.cssCustomProperty});
                padding: calc(var(${standardPadding.cssCustomProperty}) + var(${standardPadding.cssCustomProperty}));
                overflow: hidden;
                background: var(${applicationBackgroundColor.cssCustomProperty});
                font: var(${bodyPlus1Font.cssCustomProperty});
                line-height: 21px;
            }
            :scope .guidance-example-content > * {
                margin: 0 !important;
            }
            :scope .guidance-copy {
                padding: var(${standardPadding.cssCustomProperty}) var(${largePadding.cssCustomProperty}) var(${mediumPadding.cssCustomProperty});
                font: var(${bodyPlus1Font.cssCustomProperty});
                line-height: 21px;
            }
            :scope .guidance-copy > *:first-child {
                margin-top: 0;
            }
            :scope .guidance-copy > *:last-child {
                margin-bottom: 0;
            }
            :scope .guidance-copy > h3 {
                margin: 0 0 var(${mediumPadding.cssCustomProperty});
                color: var(${titlePlus1FontColor.cssCustomProperty});
                font: var(${bodyPlus1EmphasizedFont.cssCustomProperty});
                line-height: 21px;
            }
            :scope .guidance-copy p {
                max-width: none;
                font: inherit;
                line-height: inherit;
                letter-spacing: inherit;
            }
            :scope .guidance-copy ul {
                margin: 0;
                padding-left: 20px;
            }
        `}
        <header>
            {icon}
            <span>{label}</span>
        </header>
        {example ? <div className='guidance-example'><div className='guidance-example-content'>{example}</div></div> : null}
        <div className='guidance-copy'>
            <h3 className='skip-toc'>{title}</h3>
            {children}
        </div>
    </article>;
};

export const Do = ({ children, example, title }: GuidanceProp): React.JSX.Element => {
    return <Guidance
        label='Do'
        example={example}
        title={title}
        tone='do'
        icon={<NimbleIconCheck style={{ width: '16px', height: '14px' }} severity='success'/>}
    >{children}</Guidance>;
};

export const Dont = ({ children, example, title }: GuidanceProp): React.JSX.Element => {
    return <Guidance
        label="Don't"
        example={example}
        title={title}
        tone='dont'
        icon={<NimbleIconXmark style={{ width: '15px', height: '16px' }} severity='error'/>}
    >{children}</Guidance>;
};

interface TagProp {
    name: string;
    open?: boolean;
    openClose?: boolean;
    close?: boolean;
    selfClose?: boolean;
}

/**
 * Renders a "Tag" component for Storybook documentation.
 */
export const Tag = ({ name, open, openClose, close, selfClose }: TagProp): React.JSX.Element => {
    if (open) {
        return (<code>&lt;{name}&gt;</code>);
    }
    if (close) {
        return (<code>&lt;/{name}&gt;</code>);
    }
    if (openClose) {
        return (<code>&lt;{name}&gt;&lt;/{name}&gt;</code>);
    }
    if (selfClose) {
        return (<code>&lt;{name}/&gt;</code>);
    }
    return (<code>{name}</code>);
};
