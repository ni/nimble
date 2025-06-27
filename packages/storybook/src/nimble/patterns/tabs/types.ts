export const ExampleTabsType = {
    simpleTabs: 'SimpleTabs',
    simpleTabsWithToolbar: 'SimpleTabsWithToolbar',
    manyTabs: 'ManyTabs',
    wideTabs: 'WideTabs'
} as const;
export type ExampleTabsType =
    (typeof ExampleTabsType)[keyof typeof ExampleTabsType];
