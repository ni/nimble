/* eslint-disable */
import React from 'react';
import { styled } from 'storybook/theming';

// Colors from design
const ORANGE = 'var(--ni-nimble-warning-color, #FF4B00)'; // Warning
const ORANGE_TINT_10 = 'color-mix(in srgb, var(--ni-nimble-warning-color, #FF4B00) 10%, transparent)';
const TEXT = 'var(--ni-nimble-body-font-color, #161617)';

const Wrapper = ((styled as any)('div')(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 'var(--ni-nimble-xsmall-padding, 4px)',
    width: '100%',
    padding: '0 0 24px 0'
}))) as any;

const ColorBlock = ((styled as any)('div')(() => ({
    backgroundColor: ORANGE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--ni-nimble-small-padding, 6px) var(--ni-nimble-xsmall-padding, 2px)'
}))) as any;

const IconFrame = ((styled as any)('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    padding: 4
}))) as any;

const Main = ((styled as any)('div')(() => ({
    flexGrow: 1,
    backgroundColor: ORANGE_TINT_10,
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    minWidth: 1,
    minHeight: 1
}))) as any;

const TextEl = ((styled as any)('p')(({ theme }: any) => ({
    margin: 0,
    maxWidth: 700,
    fontFamily: `"Source Sans Pro", "Source_Sans_Pro", ${theme.typography.fonts.base}`,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: '21px',
    color: TEXT
}))) as any;

const Strong = ((styled as any)('span')(() => ({
    fontWeight: 600
}))) as any;

const TriangleFilled16: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 3L13 13H3L8 3Z" fill="#ffffff" />
    </svg>
);

export interface InlineGuidelineProps extends React.HTMLAttributes<HTMLDivElement> {
    prefix?: string;
    children?: React.ReactNode;
}

/**
 * InlineGuideline - warning/info callout inline with content.
 * Usage: <InlineGuideline prefix="Note:">Your message here.</InlineGuideline>
 */
export const InlineGuideline: React.FC<InlineGuidelineProps> = ({ prefix = 'Note:', children, className }) => {
    return (
        <Wrapper className={className}>
            <ColorBlock>
                <IconFrame>
                    <TriangleFilled16 />
                </IconFrame>
            </ColorBlock>
            <Main>
                <TextEl>
                    {prefix ? <Strong>{prefix} </Strong> : null}
                    {children}
                </TextEl>
            </Main>
        </Wrapper>
    );
};

export default InlineGuideline;
