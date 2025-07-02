/**
 * Types of axis autoscaling.
 * @public
 */
export const AxisAutoScale = {
    none: 'none',
    exact: 'exact',
    loose: 'loose'
} as const;
export type AxisAutoScale =
    (typeof AxisAutoScale)[keyof typeof AxisAutoScale];

export const AxisType = {
    linear: 'linear',
    log: 'log'
} as const;
export type AxisType =
    (typeof AxisType)[keyof typeof AxisType];

export interface AxisConfig {
    autoScale: AxisAutoScale;
    mode: AxisType;
    min?: number;
    max?: number;
    axisLabel?: string; // Axis label
}

export interface LinePlotConfig {
    lineWidth?: number;
    fillColor?: string;
    fill?: boolean;
    steps?: boolean;
    show?: boolean; // Whether to show lines
}

export interface PointPlotConfig {
    radius?: number;
    fillColor?: string;
    fill?: boolean;
    symbol?: string; // e.g., 'circle', 'square', 'diamond'
    show?: boolean;
}

export interface BarPlotConfig {
    barWidth?: number;
    fillColor?: string;
    show?: boolean; // Whether to show bars
}

export interface PlotStyle {
    color: string; // Color for the plot
    lines?: LinePlotConfig;
    points?: PointPlotConfig;
    bars?: BarPlotConfig;
}