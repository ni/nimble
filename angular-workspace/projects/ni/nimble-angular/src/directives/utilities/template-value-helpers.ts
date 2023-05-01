/**
 * Conversion helpers for values coming from template attributes or property bindings
 */

// Values assigned to directives can come from template attributes, ie <my-element my-number="4"></my-element>
// or from property bindings, ie <my-element [my-number]="someNumber"></my-element>
// So setters for our directives accept both string values from template attributes and
// the expected property type. This file has helpers for common property types.
// More context: https://v13.angular.io/guide/template-typecheck#input-setter-coercion

type BooleanAttribute = '' | null;
export type BooleanValueOrAttribute = boolean | BooleanAttribute;
export type NumberValueOrAttribute = number | string;

/**
 * Converts values from templates (empty string or null) or boolean bindings to a boolean property representation
 */
export const toBooleanProperty = (value: BooleanValueOrAttribute): boolean => {
    if (value === false || value === null) {
        return false;
    }
    // For boolean attributes the empty string value is true
    return true;
};

/**
 * Converts values from templates (empty string or null) or boolean bindings to an Aria boolean
 * attribute representation (the strings "true" or "false")
 */
export const toBooleanAriaAttribute = (value: BooleanValueOrAttribute): 'true' | 'false' => {
    if (value === false || value === null) {
        return 'false';
    }
    // For boolean attributes the empty string value is true
    return 'true';
};

/**
 * Converts values from templates (number representation as a string) or number bindings to a number property representation
 */
export const toNumberProperty = (value: NumberValueOrAttribute): number => {
    // Angular: https://github.com/angular/angular/blob/2664bc2b3ef4ee5fd671f915828cfcc274a36c77/packages/forms/src/directives/number_value_accessor.ts#L67
    // And Fast: https://github.com/microsoft/fast/blob/46bb6d9aab2c37105f4434db3795e176c2354a4f/packages/web-components/fast-element/src/components/attributes.ts#L100
    // Handle numeric conversions from the view differently
    // Since Number(val) https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number-constructor-number-value
    // and val * 1 https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-applystringornumericbinaryoperator
    // Are identical (use ToNumeric algorithm), went with Number() for clarity
    return Number(value);
};

/**
 * Converts values from templates (number representation as a string) or number bindings to a number property representation.
 * The values of `null` and `undefined` are also supported, and they are not converted.
 */
export const toNullableNumberProperty = (value: NumberValueOrAttribute | null | undefined): number | null | undefined => {
    if (value === undefined || value === null) {
        return value;
    }

    return toNumberProperty(value);
};
