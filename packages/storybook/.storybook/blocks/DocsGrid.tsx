/* eslint-disable */
import React from 'react';
import { styled } from 'storybook/theming';

type DocsGridProps = React.HTMLAttributes<HTMLDivElement> & {
  columns?: number;
  minColumnWidth?: number;
  gap?: number;
  children?: React.ReactNode;
};

// Generic responsive grid for docs content (flex-based, no media queries)
// - columns: desired columns per row at wide sizes (default 2). Rows will never exceed this count.
// - minColumnWidth: minimum column width before wrapping to fewer columns (default 200)
// - gap: spacing between items in px (default 16)
const Grid = ((styled as any)('div')(({ $gap = 16 }: { $gap?: number }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${$gap}px`,
  alignItems: 'stretch',
  width: '100%',
  boxSizing: 'border-box',
  paddingBlockEnd: '24px'
}))) as any;

const Cell = ((styled as any)('div')(
  ({ $columns = 2, $minCol = 200, $gap = 16 }: { $columns?: number; $minCol?: number; $gap?: number }) => ({
    // Target N columns per row at wide widths (e.g., 50% for 2 columns)
    flex: `1 1 calc(${100 / Math.max(1, $columns)}% - ${($columns - 1) * $gap / $columns}px)`,
    // Never shrink below the minimum width; items will wrap to the next line instead
    minWidth: `${$minCol}px`,
    boxSizing: 'border-box',
    // Ensure contained component stretches to fill the available cell width
    '& > *': {
      width: '100%'
    }
  })
)) as any;

export function DocsGrid({
  children,
  className,
  columns = 2,
  minColumnWidth = 200,
  gap = 16,
  style,
  ...rest
}: DocsGridProps) {
  const items = React.Children.toArray(children);
  return (
    <Grid className={className} $gap={gap} style={style} {...rest}>
      {items.map((child, index) => (
        <Cell key={(child as any)?.key ?? index} $columns={columns} $minCol={minColumnWidth} $gap={gap}>
          {child}
        </Cell>
      ))}
    </Grid>
  );
}

export default DocsGrid;
