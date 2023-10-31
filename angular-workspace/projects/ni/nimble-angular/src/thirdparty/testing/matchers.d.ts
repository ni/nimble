declare namespace jasmine {
    interface Matchers<T> {
        toHaveText(expected: string): boolean;
    }
}