export const ExampleBreadcrumbItemsType = {
    simple: 'simple',
    many: 'many',
    wide: 'wide'
} as const;
export type ExampleBreadcrumbItemsType = (typeof ExampleBreadcrumbItemsType)[keyof typeof ExampleBreadcrumbItemsType];
