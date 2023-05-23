type ObjectFromList<T extends readonly string[], V = string> = {
    [K in T extends readonly (infer U)[] ? U : never]: V;
};

/**
 * custom update bingo card helper
 */
export abstract class Tracker<
    WhimsList extends readonly string[]
> {
    private whims: ObjectFromList<WhimsList, boolean>;

    public constructor(whimsList: WhimsList) {
        type Whims = typeof this.whims;
        this.whims = {} as Whims;
        this.whims = whimsList.reduce<Whims>(
            (r, key): Whims => {
                return {
                    ...r,
                    [key]: false
                };
            },
            this.whims
        );
    }

    public track(key: keyof ObjectFromList<WhimsList, boolean>): void {
        this.whims[key] = true;
    }

    public untrack(key: keyof ObjectFromList<WhimsList, boolean>): void {
        this.whims[key] = false;
    }

    public trackAll(): void {
        this.setAllKeys(true);
    }

    public untrackAll(): void {
        this.setAllKeys(true);
    }

    public allTracked(): boolean {
        return Object.values(this.whims).every(x => !x);
    }

    public anyTracked(): boolean {
        return Object.values(this.whims).some(x => !x);
    }

    protected setAllKeys(value: boolean): void {
        type Whims = typeof this.whims;
        this.whims = Object.keys(
            this.whims
        ).reduce<Whims>((r, key): Whims => {
            return {
                ...r,
                [key]: value
            };
        }, this.whims);
    }
}
