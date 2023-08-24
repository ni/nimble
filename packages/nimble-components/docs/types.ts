export const ComponentFrameworkStatus = {
    ready: 'ready',
    incubating: 'incubating',
    notReady: 'not_ready'
} as const;
export type ComponentFrameworkStatus =
    (typeof ComponentFrameworkStatus)[keyof typeof ComponentFrameworkStatus];
