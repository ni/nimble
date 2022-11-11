# Change Log - @ni/nimble-blazor

This log was last generated on Tue, 18 Oct 2022 19:13:04 GMT and should not be manually modified.

<!-- Start content -->

## 9.1.0

Tue, 18 Oct 2022 19:13:04 GMT

### Minor changes

- Blazor support for select error state ([ni/nimble@955560d](https://github.com/ni/nimble/commit/955560d77b66b6e143592d5c295b3a38dd1bf23a))

## 9.0.0

Fri, 07 Oct 2022 21:13:41 GMT

### Major changes

- Rename nimble "radio button" to "radio" ([ni/nimble@8f496f0](https://github.com/ni/nimble/commit/8f496f0aaca48e5765e942292c88e78094e81386))

## 8.0.0

Thu, 06 Oct 2022 17:54:42 GMT

### Major changes

- - Extend styling on nimble-dialog by implementing a slotted template.
  - `aria-label` no longer correctly labels the dialog. Provide text content in the `title` and/or `subtitle` to give the dialog an accessible label.
  - Styling has changed. Update dialogs in one of the two ways:
      1. To lay out content using recommended patterns, use exposed slots of `title`, `subtitle`, and `footer` to lay out content using recommended patterns.
      2. To keep (nearly) identical layout as before this change:
          - set `header-hidden` and `footer-hidden` on the dialog
          - wrap the entire contents of the dialog in a single element, such as a `<div>` to avoid having the default flex layout applied to content
          - note: it is still recommended to provide a title/subtitle for accessibility purposes even when setting `header-hidden` ([ni/nimble@980a9da](https://github.com/ni/nimble/commit/980a9dac9961ef1487833281470f97c79f0f5197))

## 7.0.0

Tue, 04 Oct 2022 16:41:24 GMT

### Major changes

- Fix issues related to nimble-drawer by rewriting the template to use the HTML dialog ([ni/nimble@e31785b](https://github.com/ni/nimble/commit/e31785bf51ac6d2e2d188ee3dceed3d862565d3e))

## 6.0.2

Mon, 03 Oct 2022 22:16:20 GMT

### Patches

- Updating licenses to MIT ([ni/nimble@31021de](https://github.com/ni/nimble/commit/31021de203162ed44452ab54425946b220cf9f0f))

## 6.0.0

Thu, 29 Sep 2022 20:03:25 GMT

### Major changes

- Migrated from CSS classes to element attributes for configuring components. For the list of specific elements and classes changed see: [#738](https://github.com/ni/nimble/pull/738). ([ni/nimble@9023d71](https://github.com/ni/nimble/commit/9023d71ddb4740a624e5b9eac0114a0c91fbca78))

## 5.8.0

Thu, 29 Sep 2022 19:39:31 GMT

### Minor changes

- Blazor wrapper for radio button and group ([ni/nimble@eb8d708](https://github.com/ni/nimble/commit/eb8d708a8eda9e0772f9c3208c99926b12d7cb45))

## 5.7.0

Mon, 12 Sep 2022 22:11:39 GMT

### Minor changes

- Add NimbleNumberField to Blazor ([ni/nimble@7d7cb65](https://github.com/ni/nimble/commit/7d7cb6587d27bd3c05e20a94de01127ba8480112))

## 5.6.0

Tue, 30 Aug 2022 18:14:50 GMT

### Minor changes

- Blazor integration for nimble-dialog ([ni/nimble@891b62c](https://github.com/ni/nimble/commit/891b62c4f672b51f6a3c82e77a428a59763bd09c))

## 5.5.0

Wed, 10 Aug 2022 23:35:50 GMT

### Minor changes

- Nimble Tooltip Blazor Integration (#309) ([ni/nimble@ab33209](https://github.com/ni/nimble/commit/ab3320969c08460b6449bffa74e76a07d4d3277a))

## 5.4.0

Wed, 10 Aug 2022 21:38:38 GMT

### Minor changes

- Add Appearance to Combobox. ([ni/nimble@32b4ed9](https://github.com/ni/nimble/commit/32b4ed97aaaea52ff211118a405fd34922a3c0cd))

## 5.3.5

Tue, 09 Aug 2022 19:30:28 GMT

### Patches

- Adding 'Placeholder' APIs to Combobox. ([ni/nimble@2b7f674](https://github.com/ni/nimble/commit/2b7f6744f4c9f1504b3852aa059f2b1f1676222c))

## 5.3.0

Mon, 01 Aug 2022 17:08:37 GMT

### Minor changes

- Add Blazor support for nimble-card-button ([ni/nimble@dd8ef82](https://github.com/ni/nimble/commit/dd8ef820cdbe34a6091ce0140228ae0bdbe6f8cb))

## 5.2.0

Wed, 20 Jul 2022 18:41:04 GMT

### Minor changes

- Add appearance to select wrapper and example project ([ni/nimble@a188d7b](https://github.com/ni/nimble/commit/a188d7baa54e1061ad07ffa65b0e5d0a2b495238))

## 5.1.7

Mon, 18 Jul 2022 18:28:07 GMT

### Patches

- Make NI.CSharp.Analyzers a private dependency ([ni/nimble@a88aa03](https://github.com/ni/nimble/commit/a88aa03c588aeb0b2eeccf2f81b897aaf715d3ca))

## 5.1.0

Mon, 20 Jun 2022 20:39:36 GMT

### Minor changes

- Blazor integration for combobox ([ni/nimble@d6af9e7](https://github.com/ni/nimble/commit/d6af9e70b1058f46e6726f1caf22092523a0ff24))

## 5.0.0

Thu, 02 Jun 2022 15:11:56 GMT

### Major changes

- Icon names updated from the postfix Nimble*Icon to the prefix NimbleIcon*. ([ni/nimble@7d7416e](https://github.com/ni/nimble/commit/7d7416ecb6f539feed219221c905b7365c8c7f79))

## 4.0.0

Tue, 31 May 2022 17:03:58 GMT

### Major changes

- Moved font import path to _content/NimbleBlazor/nimble-tokens/css/fonts.css ([ni/nimble@eeb6783](https://github.com/ni/nimble/commit/eeb6783dd96e74365350826b44592c403ef8376d))

## 3.1.2

Mon, 23 May 2022 21:59:32 GMT

### Patches

- Test pipeline publish ([ni/nimble@0f3646d](https://github.com/ni/nimble/commit/0f3646deed98560e59d5d2a458939411c303cd29))

## 3.1.1

Mon, 23 May 2022 19:28:21 GMT

### Patches

- Publish to nuget.org ([ni/nimble@b75f06c](https://github.com/ni/nimble/commit/b75f06c9fc457338dd94aa47f14e792192867f88))

## 3.1.0

Mon, 23 May 2022 17:08:16 GMT

### Minor changes

- Blazor support for nimble-menu-button ([ni/nimble@717f2fb](https://github.com/ni/nimble/commit/717f2fbd251509bb8deee23c842dceb5c4325c84))

## 3.0.0

Wed, 18 May 2022 21:26:22 GMT

### Major changes

- Rename NimbleBlazor.Components to NimbleBlazor ([ni/nimble@6ef01f6](https://github.com/ni/nimble/commit/6ef01f660e91240fb8381984fde864774bd6b2bb))

## 2.0.4

Wed, 18 May 2022 20:52:01 GMT

### Patches

- Update icon generation dependencies ([ni/nimble@d6fdd7c](https://github.com/ni/nimble/commit/d6fdd7ce77c264d72f885b2a734a692dc1938e71))

## 2.0.0

Tue, 17 May 2022 20:06:42 GMT

### Major changes

- Replace single Appearance enum with one per control (ButtonAppearance, TextAreaAppearance, TextFieldAppearance). Add TextFieldAppearance.Frameless. ([ni/nimble@ae9c35f](https://github.com/ni/nimble/commit/ae9c35fe75d93aa8b3a947759020b8558eb92490))

## 1.2.0

Tue, 03 May 2022 22:31:24 GMT

### Minor changes

- Blazor integration for breadcrumb, drawer, tabs. Updates to example app. ([ni/nimble@2def6be](https://github.com/ni/nimble/commit/2def6be1a5370ea9f830106cd0eacb4677b96930))

## 1.1.0

Wed, 27 Apr 2022 22:20:35 GMT

### Minor changes

- Blazor integration for switch, text area, toggle button, icons. Fix 2-way binding for checkbox. ([ni/nimble@0a8039e](https://github.com/ni/nimble/commit/0a8039ede7a3fe493e1a3cc1186bdb69c960543c))

## 1.0.0

Thu, 21 Apr 2022 20:57:24 GMT

### Patches

- Nimble blazor start semantic versioning (rajsite@users.noreply.github.com)
