# Nimble Wafer Map Die Highlighting

## Problem Statement

The wafer map receives an array of strings as the values that will be highlighted.

```
@observable public highlightedValues: string[] = [];
```

In the following case the highlighted values are 2 and 3.

![Highlighted Values](resources/highlighted-values.png)

The current approach is limited. We can either highlight all the dies having 2s and 3s or neither of them. The customer needs exceeds this approach. The customer may see an anomaly on the dies having DieX: 15 and Soft Bin: 2 and wishes to highlight all these values, but the current code is not capable of this.

## Links To Relevant Work Items and Reference Material

N\A

## Implementation / Design

We will introduce a new logic of highlighting the wafer in parallel with current one.

```
export interface WaferMapDie{
...
   🟢isHighlighted?: boolean;🟢
...
}
```

```
        ...
        for (const die of this.wafermap.dies) {
            ...
            this._diesRenderInfo.push({
                ...
                fillStyle: this.calculateFillStyle(
                    die.value,
                    colorScaleMode,
                    highlightedValues,
                    🟢 die.isHighlighted🟢
                ),
                ...
            });
        }
        ...
```

```
    ...
    private calculateFillStyle(
        ...
        🟢isHighlighted?: boolean🟢
    ): string {
        ...
        rgbColor = new ColorRGBA64(
            ...
            this.calculateOpacity(value, highlightedValues, 🟢isHighlighted🟢)
        );
        ...
    }
    ...
```

```
    ...
    private calculateOpacity(
        ...
        🟢isHighlighted?: boolean🟢
    ): number {
        return 🟢isHighlighted🟢 || (highlightedValues.length > 0
            && !highlightedValues.some(dieValue => dieValue === selectedValue))
            ? this.nonHighlightedOpacity
            : 1;
    }
    ...
```

This approach will let us to highlight any die we want, without any restrictions. The logic that decides which dies should be highlighted can be moved completely out of the wafer map component, leaving the component the duty of only highlighting the given dies using the "isHighlighted" field.
