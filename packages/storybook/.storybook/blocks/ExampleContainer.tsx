/* eslint-disable */
import React from 'react';
import { styled } from 'storybook/theming';

type ExampleContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  background?: string;
  children?: React.ReactNode;
};

// Use a transient prop to avoid passing to the DOM
const Frame = ((styled as any)('div')(({ $background }: { $background?: string }) => ({
  position: 'relative',
  width: '90%',
  overflow: 'hidden',
  margin: '25px 0 40px',
  padding: '32px 30px',
  borderRadius: 5,
  background: $background ?? 'rgba(255, 255, 255, 1)',
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px',
  // Use tokenized border width when available
  border: 'var(--ni-nimble-border-width, 1px) solid rgb(211, 213, 214)'
}))) as any;

export default function ExampleContainer({
  children,
  background = 'var(--ni-nimble-application-background-color, rgb(252, 252, 252))',
  style,
  ...rest
}: ExampleContainerProps) {
  const resolvedStyle = {
    ...style,
  } as React.CSSProperties;

  return (
  <Frame $background={background} style={resolvedStyle} {...rest}>
      {children}
    </Frame>
  );
}
