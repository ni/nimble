/* eslint-disable indent, @typescript-eslint/indent */
import React, { useEffect } from 'react';
import { styled } from 'storybook/theming';
import tocbot from 'tocbot';

// Inline container instead of an <aside> with fixed nav
// eslint-disable-next-line id-match, @typescript-eslint/naming-convention
const ContainerDiv = styled.div`
  width: 100%;
`;

// eslint-disable-next-line id-match, @typescript-eslint/naming-convention
const Nav = styled.nav(({ theme }) => `
  position: static;
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 1.5rem;
  overflow-y: visible;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  & * {
    box-sizing: border-box;
  }

  /* Top-level TOC list as a horizontal row */
  & > .toc-wrapper > .toc-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 18px;
    padding: 0px 16px 0px 0px;
    margin: 0;
    list-style: none;
  }

  /* Hide nested sublists by default for the inline variant */
  & > .toc-wrapper > .toc-list .toc-list {
    display: none;
  }

  /* Each link item */
  & .toc-list-item {
    display: flex;
    align-items: center;
    height: 32px;
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  /* Link appearance per design (Source Sans Pro 17/19, semibold, underline, accent color) */
  & .toc-list-item > a {
    font-family: 'Source Sans Pro', 'Source_Sans_Pro', ${theme.typography.fonts.base};
    font-weight: 600;
    font-size: 17px;
    line-height: 19px;
    color: var(--ni-nimble-hyperlink-font-color, var(--ni-nimble-accent-color, #00734b));
    text-decoration-line: underline;
    text-decoration-skip-ink: none;
    text-underline-position: from-font;
    position: relative; /* Icon after text */
  }

  & .toc-list-item > a::after {
    content: '';
    display: inline-block;
    width: 16px;
    height: 12px;
    margin-left: 4px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none" opacity="0.6"><path d="M3 6h8m-3-4 4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  }

  /* Do not render the trailing icon for the last top-level item */
  & > .toc-wrapper > .toc-list > .toc-list-item:last-child > a::after {
    content: none;
  }
`);
/* eslint-enable indent, camelcase, id-match, @typescript-eslint/naming-convention */

// Track click handlers without mutating DOM nodes with custom properties
const tocClickHandlers = new WeakMap<Element, EventListener>();

export interface InlineTableOfContentsProps {
  disable?: boolean;
  headingSelector?: string;
  contentsSelector?: string;
  ignoreSelector?: string;
  // New: array or comma-separated string of heading titles to exclude from TOC
  exclude?: string | string[];
  unsafeTocbotOptions?: { [key: string]: unknown };
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const InlineTableOfContents: React.FC<InlineTableOfContentsProps> = ({
  disable,
  headingSelector,
  contentsSelector,
  ignoreSelector,
  exclude,
  unsafeTocbotOptions,
  className
}) => {
  useEffect(() => {
    if (disable) {
      return () => {};
    }

    // Normalize exclude list to a lowercase Set for case-insensitive comparison
    const excludeSet = (() => {
      if (!exclude) {
        return new Set<string>();
      }
      if (Array.isArray(exclude)) {
        return new Set(
          exclude
            .filter(Boolean)
            .map(s => String(s).trim().toLowerCase())
            .filter(s => s.length > 0)
        );
      }
      // support comma-separated string
      return new Set(
        String(exclude)
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(s => s.length > 0)
      );
    })();

    // Ensure our skip class is included in ignoreSelector for tocbot
    const combinedIgnoreSelector = ignoreSelector
      ? `${ignoreSelector}, .skip-toc`
      : '.docs-story *, .skip-toc';

    // Pre-mark headings to be excluded before tocbot runs
    const addedSkipMarkers: Element[] = [];
    try {
      if (excludeSet.size > 0) {
        const contentRoot = document.querySelector(
          contentsSelector ?? '.sbdocs-content'
        );
        const selector = headingSelector ?? 'h2';
  const headings = contentRoot?.querySelectorAll(selector);
  headings?.forEach(h => {
          const text = h.textContent?.trim().toLowerCase();
          if (text && excludeSet.has(text)) {
            h.classList.add('skip-toc');
            try {
              (h as HTMLElement).dataset.inlineTocSkip = 'true';
            } catch {
              // noop to satisfy no-empty
              void 0;
            }
            addedSkipMarkers.push(h);
          }
        });
      }
    } catch {
      // noop to satisfy no-empty
      void 0;
    }

    const configuration = {
      tocSelector: '.toc-wrapper',
      contentSelector: contentsSelector ?? '.sbdocs-content',
      headingSelector: headingSelector ?? 'h2',
      ignoreSelector: combinedIgnoreSelector,
      headingsOffset: 40,
      scrollSmoothOffset: -40,
      orderedList: false,
      // Prevent full iframe navigation; do smooth in-page scroll instead
    onClick: (event: unknown) => {
        try {
      // Prevent navigation outside the docs iframe
      const ev = event as Event;
      ev.preventDefault();
          // Resolve target id from href (supports absolute URLs ending with #id or just #id)
      const targetEl = ev.target as Element | null;
          const anchor = targetEl?.closest('a');
          const href = anchor?.getAttribute('href') || '';
          const hashIndex = href.indexOf('#');
          const id = hashIndex >= 0 ? href.slice(hashIndex + 1) : href.replace(/^#/, '');
          if (!id) {
            return false;
          }

          const target = document.getElementById(decodeURIComponent(id));
          if (!target) {
            return false;
          }

          // Apply same offset used by tocbot for consistency
          const offset = 40; // must match headingsOffset/scrollSmoothOffset semantics
          const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          // Update hash without navigation for deep-linkability
          try {
            const newUrl = `#${encodeURIComponent(id)}`;
            if (window.location.hash !== newUrl) {
              window.history.replaceState(null, '', newUrl);
            }
          } catch {
            // noop to satisfy no-empty
            void 0;
          }
          // After scrolling, move focus to the target for accessibility
          setTimeout(() => {
            try {
              target.setAttribute('tabindex', '-1');
              target.focus({ preventScroll: true });
            } catch {
              // noop to satisfy no-empty
              void 0;
            }
          }, 300);
          return false;
        } catch {
          // Fallback to default behavior if anything goes wrong
          return true;
        }
      },
      ...(unsafeTocbotOptions || {})
    };

    const timeout = setTimeout(() => {
      tocbot.init(configuration);
      // As a safety net, also intercept clicks via event delegation to only scroll
      const wrapper = document.querySelector('.toc-wrapper');
      const onClick: EventListener = (e: Event) => {
        const targetEl = e.target as Element | null;
        const anchor = targetEl?.closest('a');
        if (!anchor || !wrapper?.contains(anchor)) {
          return;
        }

        // Prevent navigating the iframe; do smooth scroll to anchor
        e.preventDefault();
        const href = anchor.getAttribute('href') || '';
        const hashIndex = href.indexOf('#');
        const id = hashIndex >= 0 ? href.slice(hashIndex + 1) : href.replace(/^#/, '');
        if (!id) {
          return;
        }

        const target = document.getElementById(decodeURIComponent(id));
        if (!target) {
          return;
        }
        const offset = 40;
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        try {
          const newUrl = `#${encodeURIComponent(id)}`;
          if (window.location.hash !== newUrl) {
            window.history.replaceState(null, '', newUrl);
          }
        } catch {
          // noop to satisfy no-empty
          void 0;
        }
        setTimeout(() => {
          try {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
          } catch {
            // noop to satisfy no-empty
            void 0;
          }
        }, 300);
      };
      if (wrapper) {
        wrapper.addEventListener('click', onClick);
        // Store handler for cleanup
        tocClickHandlers.set(wrapper, onClick);
      }
    }, 100);
    return () => {
      clearTimeout(timeout);
      try {
        const wrapper = document.querySelector('.toc-wrapper');
        if (wrapper) {
          const handler = tocClickHandlers.get(wrapper);
          if (handler) {
            wrapper.removeEventListener('click', handler);
            tocClickHandlers.delete(wrapper);
          }
        }
        // Clean up any skip markers we added
        if (addedSkipMarkers.length) {
      addedSkipMarkers.forEach(h => {
            try {
              h.classList.remove('skip-toc');
              const el = h as HTMLElement;
              if (el.dataset.inlineTocSkip) {
                delete el.dataset.inlineTocSkip;
              }
            } catch {
              // noop to satisfy no-empty
              void 0;
            }
          });
        }
      } catch {
        // noop to satisfy no-empty
        void 0;
      }
      tocbot.destroy();
    };
  }, [disable, ignoreSelector, contentsSelector, headingSelector, unsafeTocbotOptions, exclude]);

  return (
    <ContainerDiv className={className}>
      {!disable ? (
        <Nav aria-label="Table of contents">
          <div className="toc-wrapper" />
        </Nav>
      ) : null}
    </ContainerDiv>
  );
};

export default InlineTableOfContents;
