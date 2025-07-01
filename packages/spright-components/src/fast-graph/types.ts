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

export const PlotStyle = {
    line: 'line',
    point: 'point',
    lineAndPoint: 'lineAndPoint',
    bar: 'bar'
} as const;
export type PlotStyle =
    (typeof PlotStyle)[keyof typeof PlotStyle];