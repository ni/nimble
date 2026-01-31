import React, { useState, type ReactNode } from 'react';
import { NimbleIconCheck } from '@ni/nimble-react/icons/check';
import { NimbleThemeProvider, Theme } from '@ni/nimble-react/theme-provider';
import { NimbleIconExclamationMark } from '@ni/nimble-react/icons/exclamation-mark';

const css = (strings: TemplateStringsArray, ...values: unknown[]): React.JSX.Element => <style>
    {`@scope {${String.raw({ raw: strings }, ...values)}}`}
</style>;

interface ChildrenProp {
    children?: ReactNode;
}

/**
 * Renders a frame to match visual design of existing Storybook Doc blocks.
 */
export const Frame = ({ children }: ChildrenProp): React.JSX.Element => {
    const prefersColorSchemeDarkMediaQuery: MediaQueryList = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );
    const [theme] = useState<Theme>(prefersColorSchemeDarkMediaQuery.matches ? 'dark' : 'light');
    return <NimbleThemeProvider theme={theme}>
        {css`
            :scope {
                margin-bottom: 32px !important;
                border: 1px solid rgba(128, 128, 128, 0.2);
                border-radius: 4px;
                box-shadow: 0px 1px 4px rgba(128, 128, 128, 0.22);
                padding: 16px;
            }
        `}
        {children}
    </NimbleThemeProvider>;
};

/**
 * Renders a container with grid configuration. Use with <Column> to create grided documentation.
 * Use CSS grid syntax for the config prop to specify the number of columns and their widths.
 */
export const Container = ({ children }: ChildrenProp): React.JSX.Element => {
    return <div>
        {css`
            :scope {
                display: grid;
                align-items: center;
                grid-template-columns: 200px 1fr;
            }
        `}
        {children}
    </div>;
};

/**
 * Renders a column for use with <Container>.
 * If you need to put Nimble components in a column, use the stylingClass="controls" prop to apply the correct margins.
 */
export const Column = ({ children }: ChildrenProp): React.JSX.Element => {
    return <div>
        {css`
            :scope > * {
                margin: var(--ni-nimble-small-padding);
            }
        `}
        {children}
    </div>;
};

/**
 * Renders a simple divider to vertically separate the contents of a <Column>.
 */
export const Divider = (): React.JSX.Element => {
    return <hr/>;
};

/**
 * Renders a "Do" section for Storybook documentation.
 */
export const Do = ({ children }: ChildrenProp): React.JSX.Element => {
    return (
        <Container>
            <Column>
                <NimbleIconCheck style={{ width: '28px', height: '28px' }} severity='success'/>
            </Column>
            <Column><div>{children}</div></Column>
        </Container>
    );
};

/**
 * Renders a "Dont" section for Storybook documentation.
 */
export const Dont = ({ children }: ChildrenProp): React.JSX.Element => {
    return (
        <Container>
            <Column>
                <NimbleIconExclamationMark style={{ width: '24px', height: '24px' }} severity='error'/>
            </Column>
            <Column><div>{children}</div></Column>
        </Container>
    );
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
