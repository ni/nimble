type ObjectFromList<T extends readonly string[], V = string> = {
    [K in T extends readonly (infer U)[] ? U : never]: V;
};

/**
 * Generic Tracker which sets or resets flags and utilities
 */
export abstract class Tracker<WhimsList extends readonly string[]> {
    private _whims: ObjectFromList<WhimsList, boolean>;

    public constructor(whimsList: WhimsList) {
        type Whims = typeof this._whims;
        this._whims = {} as Whims;
        this._whims = whimsList.reduce<Whims>((r, key): Whims => {
            return {
                ...r,
                [key]: false
            };
        }, this._whims);
    }

    public get whims(): ObjectFromList<WhimsList, boolean> {
        return this._whims;
    }

    public track(key: keyof ObjectFromList<WhimsList, boolean>): void {
        this._whims[key] = true;
    }

    public untrack(key: keyof ObjectFromList<WhimsList, boolean>): void {
        this._whims[key] = false;
    }

    public trackAll(): void {
        this.setAllKeys(true);
    }

    public untrackAll(): void {
        this.setAllKeys(true);
    }

    public allTracked(): boolean {
        return Object.values(this._whims).every(x => !x);
    }

    public anyTracked(): boolean {
        return Object.values(this._whims).some(x => !x);
    }

    protected setAllKeys(value: boolean): void {
        type Whims = typeof this._whims;
        this._whims = Object.keys(this._whims).reduce<Whims>(
            (r, key): Whims => {
                return {
                    ...r,
                    [key]: value
                };
            },
            this._whims
        );
    }
}
