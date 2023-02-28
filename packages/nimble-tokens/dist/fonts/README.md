# Google Web Fonts

Original font sources:

* [Source Sans Pro](https://fonts.google.com/specimen/Source+Sans+Pro)
* [Noto Serif](https://fonts.google.com/noto/specimen/Noto+Serif)

Converted to WOFF2 format using [a tff to woff2](https://everythingfonts.com/ttf-to-woff2) recommended by [google-webfonts-helper](https://github.com/majodev/google-webfonts-helper)

# Adding new fonts

New font assets should be added to the `nimble-tokens/dist/fonts/assets` directory and referenced in from `nimble-tokens/dist/fonts/css/fonts.css` so that they will be loaded by applications using nimble.

## Fallback fonts

When adding new fonts, you should also create size-adjusted fallback fonts to use with them. Follow the pattern being used in `nimble-tokens/dist/fonts/css/fonts.css` to define new `@font-face`s that utilize some combination of the descriptors `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override`. There is an [online tool](https://deploy-preview-15--upbeat-shirley-608546.netlify.app/perfect-ish-font-fallback/) you can use to automatically select values for these descriptors. You should verify that the values produce a good result, and tweak them as needed.
