/**
 * [Nimble]
 * Copied from https://github.com/angular/angular/blob/15.2.10/packages/core/src/util/coercion.ts
 * with no modifications so that the `coerceToBoolean` function can be used by the forked directive
 * in `router_link.ts` without depending on private Angular APIs.
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/** Coerces a value (typically a string) to a boolean. */
export function coerceToBoolean(value: unknown): boolean {
    return typeof value === 'boolean' ? value : (value != null && value !== 'false');
}
