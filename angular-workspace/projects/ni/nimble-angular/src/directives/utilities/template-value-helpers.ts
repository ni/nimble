/**
 * Conversion helpers for values coming from Angular templates via
 * strings specified in templates or via property bindings
 */

// Values coming from template strings (ie not using bindings) are just string values.
// So eventhough the type of the property in the nimble directive is typed (i.e. boolean),
// Angular will pass the string representation from the template resulting in the boolean
// typed property being assigned a string.
// See: https://github.com/angular/angular/issues/6919

// For example, when used in a component as <tree-item selected></tree-item>
// the string value '' (empty string) will be assigned to the TreeItemDirective.selected property
// eventhough TreeItemDirective.selected is defined as boolean.
// When binding to a boolean value explicitly as in <tree-item [selected]="myBoolean"></tree-item> then
// TreeItemDirective.selected will be assigned a boolean as expected.

export type BooleanAttribute = '' | null;

/**
 * Converts values from templates (empty string or null) or boolean bindings to a boolean property representation
 */
export const toBooleanProperty = (value: boolean | BooleanAttribute): boolean => {
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
export const toBooleanAriaAttribute = (value: boolean | BooleanAttribute): 'true' | 'false' => {
    if (value === false || value === null) {
        return 'false';
    }
    // For boolean attributes the empty string value is true
    return 'true';
};

/**
 * Converts values from templates (number representation as a string) or number bindings to a number property representation
 */
export const toNumberProperty = (value: number | string): number => {
    return Number(value);
};
