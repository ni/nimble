<div align="center">
    <p><b>ni | unit format</b></p>
</div>

# Unit Format

[![NPM Version](https://img.shields.io/npm/v/@ni/unit-format.svg)](https://www.npmjs.com/package/@ni/unit-format)

The `@ni/unit-format` library provides a way to format numbers with units. The library:

- Provides opinionated number formatters that are well-suited for:
    - numbers that can appear in large ranges (very small or very large).
    - numbers that are always decimal with a configurable number of digits.
- Can scale number values on a unit scale, for example, a metric scale of voltage.
- Provides internationalized number formatting and unit strings.

The library is intended to align well with the [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) API to make it relatively straightforward to swap in.

## Getting Started

Choose a `UnitFormat` and create an instance with an optional `UnitScale` reference:

```ts
const formatter = new UnitFormatDefault('en', {
    unitScale: unitScaleByte
});
console.log(formatter.format(1000));
// Output: '1 kB'
```

## Concepts

### UnitFormat

There are multiple `UnitFormat`s that represent different configurations for formatting numbers. These represent wrappers around `Intl.NumberFormat` with opinionated configurations.

For example, the `UnitFormatDefault` will represent "very large" and "very small" numbers with an exponential notation and numbers between those ranges as decimal. The different `UnitFormat`s take an optional `unitScale` that provides units and automatic conversions of numbers for that unit scale.

### UnitScale

A `UnitScale` represents a collection of `ScaledUnits` where a scale factor is used to define each scaled unit. Each `UnitScale` must have a "base" `ScaledUnit` with scale factor 1. For example, a byte `UnitScale` may contain:

- a `ScaledUnit` of scale factor 1 representing bytes (the base `ScaledUnit`)
- a `ScaledUnit` of scale factor 1000 representing kilobytes.

Each `ScaledUnit` represents a scale factor and a factory function for creating a `ScaledUnitFormat` instance. This system is used so that the top-level `UnitFormat` objects can pass configuration settings to individual `ScaledUnitFormat` instances.

## ScaledUnitFormat

A `ScaledUnitFormat` is an object for formatting a particular `ScaledUnit` on the `UnitScale`.

There are two main types of `ScaledUnitFormat`s:

- `ScaledUnitFormatIntlNumberFormat` which are scaled units can be translated by [`Intl.NumberFormat`](https://tc39.es/ecma402/#table-sanctioned-single-unit-identifiers).
- `ScaledUnitFormatManuallyTranslated` which are scaled units manually translated for a set of supported languages via `UnitTranslation` string collections.

The different `ScaledUnitFormat` objects have a static function to assist with their factory creation, for example:

```ts
new ScaledUnit(
    10 ** 3,
    ScaledUnitFormatIntlNumberFormat.createFactory({
        style: 'unit',
        unit: 'kilobyte',
        unitDisplay: 'short'
    })
),
```

## Contributing

See `Getting Started` in [`CONTRIBUTING.md`](/packages/unit-format/CONTRIBUTING.md#getting-started).
