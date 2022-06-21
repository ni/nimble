# XLIFF to JSON Converter

The `@ni/xliff-to-json-converter` library converts Angular XLIFF translation files to JSON so that they can be loaded at runtime in Angular apps.

See [the NI internal wiki for more info on internationalizing NI Angular apps](https://dev.azure.com/ni/DevCentral/_wiki/wikis/AppCentral.wiki/6636/Internationalization-(Angular)).

# Usage

1. Install in your Angular app's `devDependencies`: `npm install -D @ni/xliff-to-json-converter`.
2. Add scripts to your app's `package.json` to convert translated XLIFF files to JSON.
```json
 "scripts": {
    "i18n:convert": "npm run i18n:convert:de && npm run i18n:convert:ja && npm run i18n:convert:zh",
    "i18n:convert:de": "xliff-to-json-converter --src src/locales/messages.de.xlf --dst src/locales/messages.de.json",
    "i18n:convert:ja": "xliff-to-json-converter --src src/locales/messages.ja.xlf --dst src/locales/messages.ja.json",
    "i18n:convert:zh": "xliff-to-json-converter --src src/locales/messages.zh.xlf --dst src/locales/messages.zh.json",
  },
```

3. Ensure those converted files are generated at build time and not checked in to source.

# Contributing

See [CONTRIBUTING.md](/packages/xliff-to-json-converter/CONTRIBUTING.md) for instructions to make changes to the library.

# Acknowledgements

This library is forked from [talque/xliff-to-angular-json](https://github.com/talque/xliff-to-angular-json) with additions including testing, linting, and some small functionality changes. Thanks to its main contributor [vbraun](https://github.com/vbraun) for the starting point!