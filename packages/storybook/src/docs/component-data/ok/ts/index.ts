import { ComponentFrameworkStatus } from '../../../types';

export const componentDataOkTs = [
    {
        componentName: 'Ts Icon Dynamic',
        componentHref: './?path=/docs/ok-ts-icon-dynamic--docs',
        library: 'ok',
        componentStatus: ComponentFrameworkStatus.ready,
        angularStatus: ComponentFrameworkStatus.doesNotExist,
        blazorStatus: ComponentFrameworkStatus.ready,
        reactStatus: ComponentFrameworkStatus.doesNotExist
    }
] as const;
