import {randomLcg, randomUniform} from "d3-random"

export type IValueGenerator = (x?: number, y?: number) => number;

export const goodValueGenerator = (seed:number):()=>number => {
    const source = randomLcg(seed);
    const goodRandom = randomUniform.source(source)(85, 100);
    return goodRandom;
};

export const badValueGenerator = (seed:number):()=>number => {
    const source = randomLcg(seed);
    const badRandom = randomUniform.source(source)(1, 50);
    return badRandom;
};
