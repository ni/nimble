/* eslint-disable */
import React, { useId } from 'react';
import { styled } from 'storybook/theming';

const TEXT_DEFAULT = 'var(--ni-nimble-body-font-color, #161617)';

const CheckIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VARIANTS = {
  do: {
    headerBg: 'var(--ni-nimble-success-color, #009921)',
    bodyBg: 'color-mix(in srgb, var(--ni-nimble-success-color, #009921) 10%, transparent)',
    icon: CheckIcon,
  headerGap: 6
  },
  dont: {
    headerBg: 'var(--ni-nimble-error-color, #C4000C)',
    bodyBg: 'color-mix(in srgb, var(--ni-nimble-error-color, #C4000C) 10%, transparent)',
    icon: CrossIcon,
  headerGap: 8
  }
} as const;

type VariantKey = keyof typeof VARIANTS;

const Wrapper = ((styled as any)('section')(({ maxWidth }: { maxWidth?: number }) => ({
  width: '100%',
  maxWidth: maxWidth ?? 900,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  boxSizing: 'border-box',
}))) as any;

const Header = ((styled as any)('div')(({ bg, gap }: { bg: string; gap: number }) => ({
  backgroundColor: bg,
  color: 'var(--ni-nimble-contrast-font-color, #fff)',
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap,
  padding: '0 24px',
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
}))) as any;

const HeaderIcon = styled.span(() => ({
  display: 'inline-flex',
  width: 16,
  height: 16,
  alignItems: 'center',
  justifyContent: 'center',
}));

const HeaderText = styled.span(({ theme }) => ({
  fontFamily: `'Source Sans Pro', 'Source_Sans_Pro', ${theme.typography.fonts.base}`,
  fontWeight: 700,
  fontSize: 18,
  lineHeight: '22px',
  letterSpacing: 0,
}));

const Body = ((styled as any)('div')(({ bg }: { bg: string }) => ({
  backgroundColor: bg,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px 10px 12px 10px',
  boxSizing: 'border-box',
}))) as any;

const Frame = ((styled as any)('div')(() => ({
  width: '100%',
  backgroundColor: 'var(--ni-nimble-application-background-color, #fff)',
  minHeight: 180,
  maxHeight: 280,
  overflow: 'hidden',
  padding: 32,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))) as any;

const Copy = ((styled as any)('div')(() => ({
  width: '100%',
  maxWidth: 750,
  color: TEXT_DEFAULT,
  padding: '16px 24px 8px 10px',
  boxSizing: 'border-box',
}))) as any;

const CopyTitle = styled('div')(({ theme }) => ({
  margin: 0,
  fontFamily: `"Founders Grotesk", "Founders_Grotesk", ${theme.typography.fonts.base}`,
  fontWeight: 500,
  fontSize: 18,
  lineHeight: '21px',
  letterSpacing: '0.18px',
  color: TEXT_DEFAULT,
}));

const CopyText = styled('p')(({ theme }) => ({
  margin: '6px 0 0 0',
  fontFamily: `'Source Sans Pro', 'Source_Sans_Pro', ${theme.typography.fonts.base}`,
  fontWeight: 400,
  fontSize: 15,
  lineHeight: '21px',
  color: TEXT_DEFAULT,
}));

type GuidelineProps = React.HTMLAttributes<HTMLElement> & {
  variant?: VariantKey;
  title?: React.ReactNode;
  children?: React.ReactNode;
  figure?: React.ReactNode;
  copy?: React.ReactNode;
  headerText?: string;
  maxWidth?: number;
  id?: string;
};

export default function Guideline({
  variant = 'do',
  title,
  children,
  figure,
  copy,
  headerText,
  maxWidth,
  id,
}: GuidelineProps) {
  const v = VARIANTS[variant] ?? VARIANTS.do;
  const Icon = v.icon;
  const titleId = useId();
  const headingId = id || `guideline-${variant}-${titleId}`;
  const computedHeaderText = headerText ?? (variant === 'do' ? 'DO' : 'DON’T');
  const childArray = React.Children.toArray(children);
  const hasElementChild = childArray.some((c) => React.isValidElement(c));
  const frameContent = figure ?? (hasElementChild ? children : null);
  const copyNode = copy ?? (!hasElementChild && children ? children : null);
  return (
    <Wrapper role="region" aria-labelledby={headingId} maxWidth={maxWidth}>
      <Header bg={v.headerBg} gap={v.headerGap}>
        <HeaderIcon>
          <Icon />
        </HeaderIcon>
        <HeaderText>{computedHeaderText}</HeaderText>
      </Header>
      <Body bg={v.bodyBg}>
        <Frame>{frameContent}</Frame>
      </Body>
      <Copy>
        <CopyTitle id={headingId}>{title}</CopyTitle>
        {copyNode ? <CopyText>{copyNode}</CopyText> : null}
      </Copy>
    </Wrapper>
  );
}

export function GuidelinesDo(props: Omit<GuidelineProps, 'variant'>) {
  return <Guideline variant="do" {...props} />;
}

export function GuidelinesDont(props: Omit<GuidelineProps, 'variant'>) {
  return <Guideline variant="dont" {...props} />;
}
