export type Writeable<T extends { [x: string]: unknown }> = {
    [P in string]: T[P];
};
