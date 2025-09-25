/* eslint-disable */
import React from 'react';
import { styled } from 'storybook/theming';

const TEXT_DEFAULT = 'var(--ni-nimble-body-font-color, #161617)';
const CARD_BG = 'var(--ni-nimble-application-background-color, #ffffff)';
const CARD_BORDER = 'rgba(var(--ni-nimble-action-rgb-partial-color, 22,22,23), 0.1)';

const Card = (styled('a')(({ theme }) => ({
  display: 'block',
  position: 'relative',
  textDecoration: 'none',
  color: TEXT_DEFAULT,
  backgroundColor: CARD_BG,
  borderRadius: 8,
  boxSizing: 'border-box',
  padding: '24px 20px 20px 24px',
  border: `var(--ni-nimble-border-width, 2px) solid ${CARD_BORDER}`,
  transition: 'border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease',
  outline: 'none',

  '&:hover': {
    borderColor: CARD_BORDER,
    boxShadow: '0 1px 0 0 rgba(var(--ni-nimble-action-rgb-partial-color, 22,22,23), 0.06), 0 2px 8px rgba(var(--ni-nimble-action-rgb-partial-color, 22,22,23), 0.06)'
  },
  '&:focus-visible': {
    borderColor: CARD_BORDER,
    boxShadow: '0 0 0 2px color-mix(in srgb, var(--ni-nimble-accent-color, #00734b) 40%, transparent)'
  }
})) as any);

const Title = styled('div')(({ theme }) => ({
  fontFamily: `'Source Sans Pro', 'Source_Sans_Pro', ${theme.typography.fonts.base}`,
  fontSize: 13,
  lineHeight: '19px',
  letterSpacing: '0.13px',
  textTransform: 'uppercase',
  fontWeight: 600,
  width: '100%',
}));

const Corner = ((styled as any)('div')(() => ({
  position: 'absolute',
  top: 12,
  right: 12,
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))) as any;

const ExternalLinkIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6.5 3H13v6.5M13 3l-7 7" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface HyperlinkCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'title'> {
  href?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export default function HyperlinkCard({ href, title, children, ...anchorProps }: HyperlinkCardProps) {
  const normalizeStorybookHref = (h?: string) => {
    if (!h) return '#';
    if (/^\?(path|id)=/.test(h)) {
      return `/${h}`;
    }
    if (/^\/?\?(path|id)=/.test(h)) {
      return h.startsWith('/') ? h : `/${h}`;
    }
    if (/^\/?iframe\.html\?/.test(h)) {
      const query = h.split('?')[1] || '';
      return query ? `/?${query}` : '/';
    }
    return h;
  };

  const managerHref = normalizeStorybookHref(href);

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (/^\/?\?(path|id)=/.test(managerHref)) {
      e.preventDefault();
      try {
        if (typeof window !== 'undefined' && window.top) {
          window.top.location.assign(managerHref.startsWith('/') ? managerHref : `/${managerHref}`);
        }
      } catch (_) {
        // noop
      }
    }
  };

  const isManager = /^\/?\?(path|id)=/.test(managerHref);

  return (
    <Card
      href={managerHref}
      target={isManager ? '_top' : anchorProps.target}
      rel={isManager ? 'noopener noreferrer' : anchorProps.rel}
      onClick={onClick}
      {...anchorProps}
    >
      <Title>{title}</Title>
      <Corner>
        <ExternalLinkIcon />
      </Corner>
      {children}
    </Card>
  );
}
