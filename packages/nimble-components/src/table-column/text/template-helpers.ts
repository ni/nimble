export const setTitleWhenOverflow = (
    span: HTMLElement,
    title: string
): void => {
    if (title && span.offsetWidth < span.scrollWidth) {
        span.setAttribute('title', title);
    }
};

export const removeTitle = (span: HTMLElement): void => {
    span.removeAttribute('title');
};
