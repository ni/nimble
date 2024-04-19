import React, { ReactNode } from 'react';
import './story-layout.css';
import { NimbleIconCheck } from '../../src/icons/tests/check.react';
import { NimbleIconExclamationMark } from '../../src/icons/tests/exclamation-mark.react';

interface ChildrenProp {
    children?: ReactNode;
}

/**
 * Renders a frame to match visual design of existing Storybook Doc blocks.
 */
export const Frame = ({ children }: ChildrenProp) => {
    return <div className="story-layout-frame">{children}</div>;
};

interface ContainerProp {
    children?: ReactNode;
    config?: string;
}

/**
 * Renders a container with grid configuration. Use with <Column> to create grided documentation.
 * Use CSS grid syntax for the config prop to specify the number of columns and their widths.
 */
export const Container = ({
    children,
    config = '200px 1fr'
}: ContainerProp) => {
    return (
        <div
            className="story-layout-container"
            style={{ gridTemplateColumns: config }}
        >
            {children}
        </div>
    );
};

interface ColumnProp {
    children?: ReactNode;
    stylingClass?: string;
}

/**
 * Renders a column for use with <Container>.
 * If you need to put Nimble components in a column, use the stylingClass="controls" prop to apply the correct margins.
 */
export const Column = ({ children, stylingClass = '' }: ColumnProp) => {
    const cn = `story-layout-column ${stylingClass}`;
    return <div className={cn}>{children}</div>;
};

/**
 * Renders a simple divider to vertically separate the contents of a <Column>.
 */
export const Divider = () => {
    return <hr />;
};

/**
 * Renders a "Do" section for Storybook documentation.
 */
export const Do = ({ children }: ChildrenProp) => {
    return (
        <Container config="48px 1fr">
            <Column>
                <NimbleIconCheck
                    style={{ width: '28px', height: '28px' }}
                    severity="success"
                />
            </Column>
            <Column>
                <p>{children}</p>
            </Column>
        </Container>
    );
};

/**
 * Renders a "Dont" section for Storybook documentation.
 */
export const Dont = ({ children }: ChildrenProp) => {
    return (
        <Container config="48px 1fr">
            <Column>
                <NimbleIconExclamationMark
                    style={{ width: '24px', height: '24px' }}
                    severity="error"
                />
            </Column>
            <Column>
                <p>{children}</p>
            </Column>
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
export const Tag = ({ name, open, openClose, close, selfClose }: TagProp) => {
    if (open) {
        return <code>&lt;{name}&gt;</code>;
    }
    if (close) {
        return <code>&lt;/{name}&gt;</code>;
    }
    if (openClose) {
        return (
            <code>
                &lt;{name}&gt;&lt;/{name}&gt;
            </code>
        );
    }
    if (selfClose) {
        return <code>&lt;{name}/&gt;</code>;
    }
    return <code>{name}</code>;
};
