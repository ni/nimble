export type IValueGenerator = (x: number, y: number) => number;

export const goodValueGenerator: IValueGenerator = () => {
    const odds = Math.random();
    if (odds >= 0.25) return Math.random() * (100 - 90) + 90;
    return Math.random() * 50;
};

export const badValueGenerator: IValueGenerator = () => {
    const odds = Math.random();
    if (odds <= 0.25) return Math.random() * (100 - 90) + 90;
    return Math.random() * 50;
};