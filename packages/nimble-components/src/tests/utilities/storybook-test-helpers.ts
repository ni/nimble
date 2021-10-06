import type { ViewTemplate } from '@microsoft/fast-element';

export const createRenderer = <TSource>(viewTemplate: ViewTemplate<TSource>): (source: TSource) => Node => {
    return (source: TSource): Node => {
        const fragment = document.createDocumentFragment();
        viewTemplate.render(source, fragment);
        return fragment;
    };
};
