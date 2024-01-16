# UnitFormat

## Overvew

The `UnitFormat` library provides a way to format numbers with units. The library:

-   Provides opinionated number formatters that are well-suited for:
    -   numbers that can appear in large ranges (very small or very large).
    -   numbers that are always decimal with a configurable number of digits.
-   Can scale number values on a unit scale, for example, a metric scale of voltage.
-   Provides internationalized number formatting and unit strings.

The library is intended to align well with the [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) API to make it relatively straightforward to swap in.

## Usage

Choose a `UnitFormat` and create an instance with an optional `UnitScale` reference:

```ts
const formatter = new DefaultUnitFormat('en', {
    unitScale: byteUnitScale
});
console.log(formatter.format(1000));
// Output: '1 kB'
```

## Concepts

### UnitFormat

There are multiple `UnitFormat`s that represent different configurations for formatting numbers. These represent wrappers around `Intl.NumberFormat` with opinionated configurations.

For example, the `DefaultUnitFormat` will represent "very large" and "very small" numbers with an exponential notation and numbers between those ranges as decimal. The different `UnitFormat`s take an optional `unitScale` that provides units and automatic conversions of numbers for that unit scale.

### UnitScale

There are two main types of `UnitScale`s:

-   the unit scales that extend `UnitScale` directly which are generally a unit scale where each individual unit can be translated by [`Intl.NumberFormat`](https://tc39.es/ecma402/#table-sanctioned-single-unit-identifiers).
-   unit scales extending the helper class `ManuallyTranslatedUnitScale` where each unit is given manually translated strings for the set of supported languages via `UnitTranslatation` and `UnitPrefix` string collection objects.

A `UnitScale` represents a collection of `ScaledUnits` where a scale factor is used to define each scaled unit. Each `UnitScale` must have a "base" `ScaledUnit` with scale factor 1. For example, a byte `UnitScale` may contain:

-   a `ScaledUnit` of scale factor 1 representing bytes (the base `ScaledUnit`)
-   a `ScaledUnit` of scale factor 1000 representing kilobytes.

Each `ScaledUnit` represents a scale factor and a factory function for creating a `ScaledUnitFormat` instance. This system is used so that the top-level `UnitFormat` objects can pass configuration settings to individual `ScaledUnitFormat` instances.

The different `ScaledUnitFormat` objects generally have a static function to assist with their factory creation, for example:

```ts
new ScaledUnit(
    10 ** 3,
    IntlNumberFormatScaledUnitFormat.createFactory({
        style: 'unit',
        unit: 'kilobyte',
        unitDisplay: 'short'
    })
),
```
