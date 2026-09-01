import React, { type ReactNode } from 'react';
import { NimbleIconCheck } from '@ni/nimble-react/icons/check';
import { NimbleThemeProvider, type ThemeProvider } from '@ni/nimble-react/theme-provider';
import { NimbleIconXmark } from '@ni/nimble-react/icons/xmark';
import {
    applicationBackgroundColor,
    bodyEmphasizedFont,
    bodyEmphasizedFontColor,
    bodyDisabledFontColor,
    bodyFontColor,
    bodyPlus1FontFamily,
    bodyPlus1FontSize,
    bodyPlus1FontWeight,
    bodyPlus1EmphasizedFontWeight,
    bodyPlus1EmphasizedFont,
    bodyPlus1Font,
    bodyPlus1FontColor,
    buttonAccentBlockFontColor,
    buttonLabelFont,
    buttonLabelFontWeight,
    cardBorderColor,
    dialogLargeWidth,
    dividerBackgroundColor,
    dividerWidth,
    elevation1BoxShadow,
    failColor,
    largePadding,
    linkProminentFontColor,
    mediumPadding,
    passColor,
    smallPadding,
    standardPadding,
    subtitlePlus1FontColor,
    tableRowBorderColor,
    tooltipCaptionFont,
    titlePlus1FontColor,
    titlePlus2FontColor,
    headlinePlus1FontColor,
    iconColor,
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { tokenNames } from '@ni/nimble-components/dist/esm/theme-provider/design-token-names';
import { tokenValues } from '@ni/nimble-components/dist/esm/theme-provider/design-token-values';

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

interface StoryTokenStyles extends React.CSSProperties {
    [name: `--ni-nimble-${string}`]: string;
}

const storyTokenStyles = (Object.keys(tokenValues) as (keyof typeof tokenValues)[]).reduce<StoryTokenStyles>(
    (styles, tokenName) => {
        const cssTokenName = tokenNames[tokenName];
        const value = tokenValues[tokenName];
        styles[`--ni-nimble-${cssTokenName}`] = typeof value === 'string' ? value : value[theme];
        return styles;
    },
    {}
);

interface StorySectionProps extends ChildrenProp {
    id: string;
    title: string;
    level?: 2 | 3;
}

export interface StoryTocItem {
    id: string;
    title: string;
    level: 2 | 3;
}

interface StoryPageProps extends ChildrenProp {
    toc?: readonly StoryTocItem[];
}

export const StoryTableOfContents = ({ items }: { items: readonly StoryTocItem[] }): React.JSX.Element => {
    const [activeId, setActiveId] = React.useState(items[0]?.id ?? '');

    React.useEffect(() => {
        const headings = items
            .map(item => document.getElementById(item.id))
            .filter((heading): heading is HTMLElement => heading instanceof HTMLElement);

        if (headings.length === 0) {
            return undefined;
        }

        const firstHeading = headings[0];
        if (!firstHeading) {
            return undefined;
        }

        const hashHeading = headings.find(heading => heading.id === window.location.hash.slice(1));
        if (hashHeading) {
            hashHeading.scrollIntoView({ block: 'start' });
            setActiveId(hashHeading.id);
        }

        const updateActiveHeading = (): void => {
            if (window.scrollY === 0) {
                setActiveId(firstHeading.id);
                return;
            }
            let activeHeading = firstHeading;
            const activationLine = window.innerHeight / 3;
            for (const heading of headings.slice(1)) {
                if (heading.getBoundingClientRect().top <= activationLine) {
                    activeHeading = heading;
                }
            }
            setActiveId(activeHeading.id);
        };

        updateActiveHeading();
        window.addEventListener('scroll', updateActiveHeading, { passive: true });
        window.addEventListener('resize', updateActiveHeading);
        return () => {
            window.removeEventListener('scroll', updateActiveHeading);
            window.removeEventListener('resize', updateActiveHeading);
        };
    }, [items]);

    return <nav aria-labelledby='story-table-of-contents' className='story-table-of-contents'>
        {css`
            :scope {
                align-self: start;
                min-width: 0;
                position: sticky;
                top: var(${standardPadding.cssCustomProperty});
                font: var(${tooltipCaptionFont.cssCustomProperty});
            }
            :scope h2 {
                margin: 0 0 var(${standardPadding.cssCustomProperty});
                padding: 0;
                border: 0;
                color: var(${bodyDisabledFontColor.cssCustomProperty});
                font: var(${buttonLabelFont.cssCustomProperty});
                text-transform: uppercase;
            }
            :scope ol {
                margin: 0;
                padding: 0;
                border-inline-start: var(${dividerWidth.cssCustomProperty}) solid var(${dividerBackgroundColor.cssCustomProperty});
                list-style: none;
            }
            :scope li {
                position: relative;
                margin: 0;
                padding: var(${smallPadding.cssCustomProperty}) var(${mediumPadding.cssCustomProperty});
            }
            :scope li[data-level='3'] {
                padding-inline-start: var(${largePadding.cssCustomProperty});
            }
            :scope li[data-active='true']::before {
                position: absolute;
                inset-block: 0;
                inset-inline-start: calc(-1 * var(${dividerWidth.cssCustomProperty}));
                border-inline-start: var(${dividerWidth.cssCustomProperty}) solid var(${linkProminentFontColor.cssCustomProperty});
                content: '';
            }
            :scope a {
                display: block;
                color: var(${bodyDisabledFontColor.cssCustomProperty});
                font: inherit;
                text-decoration: none;
            }
            :scope li[data-active='true'] a {
                color: var(${bodyFontColor.cssCustomProperty});
                font-weight: var(${bodyPlus1EmphasizedFontWeight.cssCustomProperty}, 600);
            }
            :scope a:focus-visible {
                outline: var(${dividerWidth.cssCustomProperty}) solid var(${linkProminentFontColor.cssCustomProperty});
                outline-offset: var(${smallPadding.cssCustomProperty});
            }
            @media (max-width: 800px) {
                :scope {
                    display: none;
                }
            }
        `}
        <h2 id='story-table-of-contents'>Contents</h2>
        <ol>
            {items.map(item => <li key={item.id} data-level={item.level} data-active={item.id === activeId}>
                <a
                    href={`#${item.id}`}
                    aria-current={item.id === activeId ? 'location' : undefined}
                    onClick={event => {
                        event.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ block: 'start' });
                        setActiveId(item.id);
                    }}
                >{item.title}</a>
            </li>)}
        </ol>
    </nav>;
};

export const StoryPage = ({ children, toc = [] }: StoryPageProps): React.JSX.Element => {
    const themeProviderRef = React.useRef<ThemeProvider>(null);

    React.useLayoutEffect(() => {
        themeProviderRef.current?.setAttribute('theme', theme);
    }, []);

    return <NimbleThemeProvider ref={themeProviderRef} theme={theme}>
        <div className='story-page' style={storyTokenStyles}>
            {css`
                :scope {
                    position: relative;
                    gap: var(${standardPadding.cssCustomProperty});
                    width: 100%;
                    max-width: var(${dialogLargeWidth.cssCustomProperty});
                    margin-inline: auto;
                }
                :scope > .story-page-toc {
                    position: absolute;
                    inset-block: 0;
                    inset-inline-start: calc(100% + var(${largePadding.cssCustomProperty}) + var(${standardPadding.cssCustomProperty}));
                    width: max-content;
                }
                :scope > .story-page-content {
                    min-width: 0;
                }
                @media (max-width: 640px) {
                    :scope {
                        gap: 0;
                    }
                }
            `}
            {toc.length > 0 ? <div className='story-page-toc'><StoryTableOfContents items={toc}/></div> : null}
            <main className='story-page-content'>
                {css`
                :scope {
                    box-sizing: border-box;
                    width: 100%;
                    min-width: 0;
                    margin-inline: auto;
                    padding: 0 var(${standardPadding.cssCustomProperty}) var(${largePadding.cssCustomProperty});
                    color: var(${bodyPlus1FontColor.cssCustomProperty});
                    background: var(${applicationBackgroundColor.cssCustomProperty});
                    font-family: var(${bodyPlus1FontFamily.cssCustomProperty});
                    font-size: var(${bodyPlus1FontSize.cssCustomProperty});
                    font-weight: var(${bodyPlus1FontWeight.cssCustomProperty});
                    line-height: 21px;
                }
                :scope *, :scope *::before, :scope *::after {
                    box-sizing: border-box;
                }
                :scope h1 {
                    margin: 0 0 calc(var(${largePadding.cssCustomProperty}) + var(${standardPadding.cssCustomProperty}));
                    scroll-margin-block-start: var(${largePadding.cssCustomProperty});
                    color: var(${headlinePlus1FontColor.cssCustomProperty});
                    font-family: var(${bodyPlus1FontFamily.cssCustomProperty});
                    font-size: 52px;
                    font-weight: var(${buttonLabelFontWeight.cssCustomProperty}, 600);
                    line-height: 56px;
                    letter-spacing: -1px;
                }
                :scope h2 {
                    margin: 36px 0 var(${largePadding.cssCustomProperty});
                    scroll-margin-block-start: var(${largePadding.cssCustomProperty});
                    padding-bottom: calc(var(${mediumPadding.cssCustomProperty}) + var(${smallPadding.cssCustomProperty}));
                    border-bottom: var(${dividerWidth.cssCustomProperty}) solid var(${dividerBackgroundColor.cssCustomProperty});
                    color: var(${titlePlus2FontColor.cssCustomProperty});
                    font-family: var(${bodyPlus1FontFamily.cssCustomProperty});
                    font-size: 30px;
                    font-weight: var(${bodyPlus1FontWeight.cssCustomProperty});
                    line-height: 34px;
                }
                :scope h2:first-of-type {
                    margin-top: 36px;
                }
                :scope h3 {
                    margin: calc(var(${largePadding.cssCustomProperty}) + var(${mediumPadding.cssCustomProperty}) + var(${smallPadding.cssCustomProperty})) 0 var(${standardPadding.cssCustomProperty});
                    scroll-margin-block-start: var(${largePadding.cssCustomProperty});
                    color: var(${subtitlePlus1FontColor.cssCustomProperty});
                    font-family: var(${bodyPlus1FontFamily.cssCustomProperty});
                    font-size: 21px;
                    font-weight: var(${buttonLabelFontWeight.cssCustomProperty}, 600);
                    line-height: 26px;
                    letter-spacing: -1px;
                }
                :scope h3:first-of-type {
                    margin-top: calc(var(${largePadding.cssCustomProperty}) + var(${mediumPadding.cssCustomProperty}) + var(${smallPadding.cssCustomProperty}));
                }
                :scope h4 {
                    margin: var(${largePadding.cssCustomProperty}) 0 calc(var(${mediumPadding.cssCustomProperty}) + var(${smallPadding.cssCustomProperty}));
                    color: var(${bodyEmphasizedFontColor.cssCustomProperty});
                    font-family: var(${bodyPlus1FontFamily.cssCustomProperty});
                    font-size: var(${bodyPlus1FontSize.cssCustomProperty});
                    font-weight: var(${buttonLabelFontWeight.cssCustomProperty}, 600);
                    line-height: 21px;
                }
                :scope h5 {
                    color: var(${bodyEmphasizedFontColor.cssCustomProperty});
                    font-family: var(${bodyPlus1FontFamily.cssCustomProperty});
                    font-size: 14px;
                    font-weight: var(${buttonLabelFontWeight.cssCustomProperty}, 600);
                    line-height: 16px;
                }
                :scope a {
                    font: inherit;
                }
                :scope strong {
                    font-weight: var(${buttonLabelFontWeight.cssCustomProperty}, 600);
                }
                :scope p:first-child {
                    margin-top: 0;
                }
                :scope p {
                    max-width: 750px;
                }
                :scope code {
                    font: var(${bodyEmphasizedFont.cssCustomProperty});
                    padding-top: 2px;
                }
                `}
                {children}
            </main>
        </div>
    </NimbleThemeProvider>;
};

export const StorySection = ({ id, title, level = 2, children }: StorySectionProps): React.JSX.Element => {
    const Heading = level === 3 ? 'h3' : 'h2';
    return <section>
        <Heading id={id}>{title}</Heading>
        {children}
    </section>;
};

export const StorySubsection = ({ id, title, children }: StorySectionProps): React.JSX.Element => {
    return <section>
        <h3 id={id}>{title}</h3>
        {children}
    </section>;
};

export const StoryPreview = ({ children }: ChildrenProp): React.JSX.Element => {
    return <div>
        {css`
            :scope {
                margin: calc(var(${largePadding.cssCustomProperty}) + var(${mediumPadding.cssCustomProperty}) + var(${smallPadding.cssCustomProperty})) 0 calc(var(${largePadding.cssCustomProperty}) + var(${mediumPadding.cssCustomProperty}));
                border: var(${dividerWidth.cssCustomProperty}) solid var(${tableRowBorderColor.cssCustomProperty});
                border-radius: 4px;
                overflow: hidden;
                background: var(${applicationBackgroundColor.cssCustomProperty});
            }
            :scope > * {
                margin: 0 !important;
            }
        `}
        {children}
    </div>;
};

export const StoryApi = ({ children }: ChildrenProp): React.JSX.Element => {
    return <div>
        {css`
            :scope {
                margin: var(${largePadding.cssCustomProperty}) 0 calc(var(${largePadding.cssCustomProperty}) + var(${mediumPadding.cssCustomProperty}));
                overflow-x: auto;
            }
            :scope .docblock-argstable {
                margin-inline: 0;
            }
            :scope > * {
                margin-top: var(${standardPadding.cssCustomProperty});
            }
            :scope > *:first-child {
                margin-top: 0;
            }
        `}
        {children}
    </div>;
};

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

export const StoryShowcase = ({ children }: ChildrenProp): React.JSX.Element => {
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
            :scope .story-showcase-actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                gap: var(${standardPadding.cssCustomProperty});
            }
            :scope .story-showcase-button-stack {
                display: flex;
                width: min(100%, 420px);
                flex-direction: column;
                align-items: center;
                gap: var(${standardPadding.cssCustomProperty});
            }
            :scope .story-showcase-button-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: var(${standardPadding.cssCustomProperty});
            }
            :scope .story-showcase-button-stack hr {
                width: 100%;
                margin: 0;
                border: 0;
                border-top: var(${dividerWidth.cssCustomProperty}) solid var(${dividerBackgroundColor.cssCustomProperty});
            }
            @media (max-width: 640px) {
                :scope .story-showcase-preview {
                    min-height: 128px;
                    padding: var(${standardPadding.cssCustomProperty});
                }
            }
        `}
        {children}
    </div>;
};

/**
 * Renders a frame to match visual design of existing Storybook Doc blocks.
 */
export const Frame = ({ children }: ChildrenProp): React.JSX.Element => {
    return <div>
        {css`
            :scope {
                margin-bottom: var(${largePadding.cssCustomProperty}) !important;
                overflow: hidden;
                border: var(${dividerWidth.cssCustomProperty}) solid var(${cardBorderColor.cssCustomProperty});
                border-radius: 4px;
                box-shadow: var(${elevation1BoxShadow.cssCustomProperty});
                background: var(${applicationBackgroundColor.cssCustomProperty});
            }
        `}
        {children}
    </div>;
};

interface ContainerProp {
    children?: ReactNode;
    config?: string;
}

/**
 * Renders a container with grid configuration. Use with <Column> to create grided documentation.
 * Use CSS grid syntax for the config prop to specify the number of columns and their widths.
 */
export const Container = ({ children, config = '200px 1fr' }: ContainerProp): React.JSX.Element => {
    return <div style={{ gridTemplateColumns: config }}>
        {css`
            :scope {
                display: grid;
                min-width: 0;
                align-items: stretch;
                gap: calc(var(${standardPadding.cssCustomProperty}) + var(${standardPadding.cssCustomProperty}));
            }
            @media (max-width: 640px) {
                :scope {
                    grid-template-columns: 1fr !important;
                    gap: var(${standardPadding.cssCustomProperty});
                }
            }
        `}
        {children}
    </div>;
};

interface ColumnProp {
    children?: ReactNode;
    stylingClass?: string;
}

/**
 * Renders a column for use with <Container>.
 * If you need to put Nimble components in a column, use the stylingClass="controls" prop to apply the correct margins.
 */
export const Column = ({ children, stylingClass = '' }: ColumnProp): React.JSX.Element => {
    return <div className={stylingClass}>
        {css`
            :scope {
                min-width: 0;
            }
            :scope.controls {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                gap: var(${standardPadding.cssCustomProperty});
                padding: var(${largePadding.cssCustomProperty});
            }
            :scope.controls > * {
                margin: 0;
            }
            :scope:not(.controls) > * {
                margin: var(${smallPadding.cssCustomProperty});
            }
        `}
        {children}
    </div>;
};

/**
 * Renders a simple divider to vertically separate the contents of a <Column>.
 */
export const Divider = (): React.JSX.Element => {
    return <div>
        {css`
            :scope hr {
                width: 100%;
                margin: var(${mediumPadding.cssCustomProperty}) 0;
                border: 0;
                border-top: var(${dividerWidth.cssCustomProperty}) solid var(${dividerBackgroundColor.cssCustomProperty});
            }
        `}
        <hr/>
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
                display: flex;
                width: 100%;
                min-height: 180px;
                align-items: center;
                justify-content: center;
                padding: calc(var(${standardPadding.cssCustomProperty}) + var(${standardPadding.cssCustomProperty}));
                overflow: hidden;
                background: var(${applicationBackgroundColor.cssCustomProperty});
                font: var(${bodyPlus1Font.cssCustomProperty});
                line-height: 21px;
            }
            :scope .guidance-example-content > * {
                margin: 0 !important;
            }
            :scope .guidance-example .story-guidance-actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                gap: var(${standardPadding.cssCustomProperty});
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
            :scope .guidance-copy > h4 {
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
            <h4>{title}</h4>
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
