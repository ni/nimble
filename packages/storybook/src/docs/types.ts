export const ComponentFrameworkStatus = {
    ready: 'ready',
    spright: 'spright',
    incubating: 'incubating',
    doesNotExist: 'does_not_exist'
} as const;
export type ComponentFrameworkStatus = (typeof ComponentFrameworkStatus)[keyof typeof ComponentFrameworkStatus];
