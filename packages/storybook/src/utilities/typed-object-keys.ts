// Based on https://fettblog.eu/typescript-better-object-keys/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ObjectConstructor {
    keys<T extends object>(o: T): (keyof T)[];
}
