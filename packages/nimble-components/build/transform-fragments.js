/* eslint-disable */
// Copied from FAST
// https://github.com/microsoft/fast/blob/a8aada16c7b089728a13a6bb7d98b8b928bb2b4f/build/transform-fragments.js
// Should replace with shared package when available: https://github.com/microsoft/fast/issues/5099

/**
 * Reduces extra spaces in HTML tagged templates.
 *
 * @param {string} data - the fragment value
 * @returns string
 */
 export function transformHTMLFragment(data) {
    data = data.replace(/\s*([<>])\s*/g, "$1"); // remove spaces before and after angle brackets
    return data.replace(/\s{2,}/g, " "); // Collapse all sequences to 1 space
}

/**
 * Reduces extra spaces in CSS tagged templates.
 *
 * Breakdown of this regex:
 *   (?:\s*\/\*(?:[\s\S])+?\*\/\s*)  Remove comments (non-capturing)
 *   (?:;)\s+(?=\})  Remove semicolons and spaces followed by property list end (non-capturing)
 *   \s+(?=\{)  Remove spaces before property list start (non-capturing)
 *   (?<=:)\s+  Remove spaces after property declarations (non-capturing)
 *   \s*([{};,])\s*  Remove extra spaces before and after braces, semicolons, and commas (captures)
 *
 * @param {string} data - the fragment value
 * @returns string
 */
export function transformCSSFragment(data) {
    if (/\/\*(?![\s\S]*\*\/)[\s\S]*/g.test(data)) {
        throw new Error("Unterminated comment found in CSS tagged template literal");
    }

    return data.replace(
        /(?:\s*\/\*(?:[\s\S])+?\*\/\s*)|(?:;)\s+(?=\})|\s+(?=\{)|(?<=:)\s+|\s*([{};,])\s*/g,
        "$1"
    );
}
