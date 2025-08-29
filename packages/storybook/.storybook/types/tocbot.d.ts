/* eslint-disable */
declare module 'tocbot' {
  interface TocbotOptions {
    // Allow additional vendor options
    [key: string]: unknown;
    tocSelector: string;
    contentSelector: string;
    headingSelector?: string;
    ignoreSelector?: string;
    orderedList?: boolean;
    headingsOffset?: number;
    scrollSmoothOffset?: number;
    onClick?: (event: unknown) => boolean | undefined;
  }
  interface TocbotApi {
    init(options: TocbotOptions): void;
    destroy(): void;
  }
  const tocbot: TocbotApi;
  export default tocbot;
}
