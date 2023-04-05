# Change Log - @ni/nimble-components

This log was last generated on Wed, 05 Apr 2023 18:54:28 GMT and should not be manually modified.

<!-- Start content -->

## 18.10.1

Wed, 05 Apr 2023 18:54:28 GMT

### Patches

- Upgrade to typescript 4.7.4 ([ni/nimble@2dd4d31](https://github.com/ni/nimble/commit/2dd4d31306ba122fb8f5378cd83e8abc83bfa618))
- Bump @ni/nimble-tokens to v4.7.2

## 18.10.0

Wed, 05 Apr 2023 17:16:16 GMT

### Minor changes

- Anchor tree item component ([ni/nimble@1827deb](https://github.com/ni/nimble/commit/1827debb2b303a140bee1b23a01f8d94dbc35247))

## 18.9.1

Tue, 04 Apr 2023 23:23:52 GMT

### Patches

- Table updates: use custom element (TableCellView) in cells, cells are notified of row recycling, action menus are closed on scroll/ row recycles. ([ni/nimble@91172d9](https://github.com/ni/nimble/commit/91172d95006601f5bb57a8831238e114f837dbf5))

## 18.9.0

Tue, 04 Apr 2023 19:42:20 GMT

### Minor changes

- Error state and update of focus state visuals for text area component ([ni/nimble@32bd2ad](https://github.com/ni/nimble/commit/32bd2adecfea401853993df53e8307e060ceb45a))

## 18.8.4

Mon, 03 Apr 2023 21:31:32 GMT

### Patches

- Allow events to bubble enough for Angular nimbleRouterLink directive to work ([ni/nimble@9bcfe99](https://github.com/ni/nimble/commit/9bcfe9997a520cf952e63fd48440dc23f13ec63d))

## 18.8.3

Mon, 03 Apr 2023 18:19:24 GMT

### Patches

- Change menu to explicit side-effect import of anchored-region ([ni/nimble@ed97369](https://github.com/ni/nimble/commit/ed97369fe171c4f2535e651e09a0a20214bbebcc))

## 18.8.2

Sat, 01 Apr 2023 05:14:36 GMT

### Patches

- Add missing anchored region import to menu component as part of Storybook 7 upgrade ([ni/nimble@b2ab12c](https://github.com/ni/nimble/commit/b2ab12c6ab80c0ad5bad389893dd52e9a04995be))

## 18.8.1

Wed, 22 Mar 2023 20:54:34 GMT

### Patches

- Update table header styling to not reserve space for sort icon ([ni/nimble@459bc0e](https://github.com/ni/nimble/commit/459bc0e425822ee15ba62c557f86dd78b92d4158))

## 18.8.0

Wed, 15 Mar 2023 15:36:39 GMT

### Minor changes

- Implement anchor menu item component ([ni/nimble@f1d6370](https://github.com/ni/nimble/commit/f1d6370d5548786004b5ef5d07b7657504d1fdf3))

## 18.7.0

Tue, 14 Mar 2023 14:51:12 GMT

### Minor changes

- Expose element tag name for some components that were missing it ([ni/nimble@f5c6a7c](https://github.com/ni/nimble/commit/f5c6a7cc64b1892d1e0c5d75a64637f7043ee020))

## 18.6.4

Fri, 10 Mar 2023 23:11:05 GMT

### Patches

- Queue table changes and process them in a batch ([ni/nimble@278811b](https://github.com/ni/nimble/commit/278811bfbe152b64978c9552de1a815bd015fcb1))

## 18.6.3

Fri, 10 Mar 2023 22:17:50 GMT

### Patches

- Programmatic table column width API ([ni/nimble@d38391e](https://github.com/ni/nimble/commit/d38391e69c9984de80bf7f4a41cfbcc0181e0d16))

## 18.6.2

Fri, 10 Mar 2023 17:48:14 GMT

### Patches

- Support "." in table record field names ([ni/nimble@a38c155](https://github.com/ni/nimble/commit/a38c155c6c5c7d80e1123ad9e5f00495b57e8b34))

## 18.6.1

Thu, 09 Mar 2023 22:36:20 GMT

### Patches

- Set title attribute in text column ([ni/nimble@f7cb89f](https://github.com/ni/nimble/commit/f7cb89f7523890976b652940dac06f49aeb3017b))

## 18.6.0

Thu, 02 Mar 2023 18:38:23 GMT

### Minor changes

- Exposed a constant for tag names on nimble components. Enabled Chromatic TurboSnap to reduce the number of Chromatic snapshots consumed by the Nimble build pipeline. ([ni/nimble@4ae2070](https://github.com/ni/nimble/commit/4ae2070766afb33d5be6df1d25dcf3df93f75deb))

## 18.5.8

Thu, 02 Mar 2023 17:48:41 GMT

### Patches

- Add programmatic column sorting support to the table ([ni/nimble@1a1e630](https://github.com/ni/nimble/commit/1a1e630c2741fd00d73f6b6be700aada832143c4))

## 18.5.7

Wed, 01 Mar 2023 18:28:57 GMT

### Patches

- Using new fallback font definitions from `nimble-tokens` that more closely match the design system fonts. This helps minimize font swap jitter on initial page load. ([ni/nimble@29c1ec3](https://github.com/ni/nimble/commit/29c1ec36b4284fff6e104f61a1c483f94945870c))
- Bump @ni/nimble-tokens to v4.7.1

## 18.5.6

Wed, 01 Mar 2023 17:20:37 GMT

### Patches

- Make tab panels scrollable ([ni/nimble@87eb2c0](https://github.com/ni/nimble/commit/87eb2c0a840f5afe1715e3115eeb5c4edff8ffdb))

## 18.5.5

Wed, 01 Mar 2023 14:29:04 GMT

### Patches

- Implementation for die padding for the wafer map component ([ni/nimble@0e89134](https://github.com/ni/nimble/commit/0e8913430f74431f5cf8a780b2f17f656480b683))

## 18.5.4

Tue, 28 Feb 2023 11:04:40 GMT

### Patches

- Implementation for the hover feature in the Wafer map component ([ni/nimble@05d4139](https://github.com/ni/nimble/commit/05d4139de721834e107f2d9db15111f41f19309f))

## 18.5.3

Tue, 21 Feb 2023 20:30:27 GMT

### Patches

- Allow table columns to be marked as hidden ([ni/nimble@8fcdeb8](https://github.com/ni/nimble/commit/8fcdeb884b9be29b92b4e273991fbc96f077d744))

## 18.5.2

Mon, 20 Feb 2023 17:53:22 GMT

### Patches

- New HLD for the hover feature of the Wafer Map component ([ni/nimble@e129dbb](https://github.com/ni/nimble/commit/e129dbb98df339c7f0b1f5b3db195bbbef5e93e9))

## 18.5.1

Mon, 20 Feb 2023 15:59:14 GMT

### Patches

- Change table column base methods into internal observable properties ([ni/nimble@cb3179f](https://github.com/ni/nimble/commit/cb3179ff097069bb7be9af0153e6745ffe6970d2))

## 18.5.0

Fri, 17 Feb 2023 21:25:30 GMT

### Minor changes

- Define type for banner toggle event detail ([ni/nimble@8c748c8](https://github.com/ni/nimble/commit/8c748c8f5e1b67bb7f2c984f1a91c14f967108c8))

## 18.4.1

Fri, 17 Feb 2023 19:44:11 GMT

### Patches

- Provide ability to specify an action menu for a table column ([ni/nimble@0cc63e6](https://github.com/ni/nimble/commit/0cc63e618d789506063b68d2b153059df2d21b1f))

## 18.4.0

Wed, 15 Feb 2023 21:23:30 GMT

### Minor changes

- Banner component ([ni/nimble@0248f3d](https://github.com/ni/nimble/commit/0248f3d6d7a0e0dcc7c6a9d4fb982bdbb78ea3d5))

## 18.3.7

Tue, 14 Feb 2023 22:59:44 GMT

### Patches

- Fix bug where pointer events were being swallowed by table row hover ([ni/nimble@0edf085](https://github.com/ni/nimble/commit/0edf08583fe9196ca449b701e417980e7514adac))

## 18.3.6

Tue, 14 Feb 2023 19:59:45 GMT

### Patches

- Changed canvas size and zoom behavior for the Wafer Map Component ([ni/nimble@97c87a7](https://github.com/ni/nimble/commit/97c87a718b735c46f3d3b4e109302c368fa3e161))

## 18.3.5

Tue, 14 Feb 2023 17:27:05 GMT

### Patches

- Add column IDs to table ([ni/nimble@a88731d](https://github.com/ni/nimble/commit/a88731d393687500fc23f86437a73bc6c947e17f))

## 18.3.4

Tue, 14 Feb 2023 16:15:37 GMT

### Patches

- Bump @ni/nimble-tokens to v4.7.0

## 18.3.3

Tue, 14 Feb 2023 15:44:48 GMT

### Patches

- Support dynamic arbitrary header content ([ni/nimble@9b95448](https://github.com/ni/nimble/commit/9b954486247d818d9f5326c1942d51d6a6d0af7b))

## 18.3.2

Mon, 13 Feb 2023 23:05:12 GMT

### Patches

- Table styling update to headers when scrollbar is showing ([ni/nimble@97201af](https://github.com/ni/nimble/commit/97201afa8cc6499a8d1c3b1b593f377cfee883cf))

## 18.3.1

Fri, 10 Feb 2023 20:11:53 GMT

### Patches

- Fix background color of dropdown listbox ([ni/nimble@571f121](https://github.com/ni/nimble/commit/571f121aa06be77e178a794846dbe0ef985433b8))

## 18.3.0

Fri, 10 Feb 2023 19:40:36 GMT

### Minor changes

- Add icons for column sorting ([ni/nimble@4df842d](https://github.com/ni/nimble/commit/4df842d8bc104a9f02d4f73c76f778c6f7b71ef8))
- Bump @ni/nimble-tokens to v4.6.0

## 18.2.0

Fri, 10 Feb 2023 15:26:34 GMT

### Minor changes

- Add new save icon ([ni/nimble@b5ca27c](https://github.com/ni/nimble/commit/b5ca27c7db12c4d69eaf4cc0b57cd15ebc581ddb))
- Bump @ni/nimble-tokens to v4.5.0

## 18.1.4

Thu, 09 Feb 2023 17:09:32 GMT

### Patches

- Fix issue re-rendering table cells when the table becomes valid again ([ni/nimble@26cdfea](https://github.com/ni/nimble/commit/26cdfeae9c0c418b48f8ed10acb82c8594960f2a))

## 18.1.3

Thu, 09 Feb 2023 14:24:11 GMT

### Patches

- Add zoom functionality to wafer map ([ni/nimble@61ae65c](https://github.com/ni/nimble/commit/61ae65cf7c5ce57cd17a1deb03bed1186a04a871))

## 18.1.2

Tue, 07 Feb 2023 20:17:44 GMT

### Patches

- Fix nimble-table virtualizer bug (when table height changes) ([ni/nimble@48e5e07](https://github.com/ni/nimble/commit/48e5e07874f03ce339e2c05b8345500fd5d5e654))

## 18.1.1

Mon, 06 Feb 2023 16:22:19 GMT

### Patches

- remove explicitly calling out 'null' in type of table's idFieldName property ([ni/nimble@00800bd](https://github.com/ni/nimble/commit/00800bde3e48f362e0cb0c648e947272b5696b34))

## 18.1.0

Mon, 30 Jan 2023 19:00:43 GMT

### Minor changes

- Nimble dependencies updated to latest ([ni/nimble@e1da136](https://github.com/ni/nimble/commit/e1da13662d82fa41f81f038335e6a142355de29e))
- Bump @ni/nimble-tokens to v4.4.0

## 18.0.3

Fri, 27 Jan 2023 20:53:57 GMT

### Patches

- Add virtualization to table ([ni/nimble@c334239](https://github.com/ni/nimble/commit/c334239a606b1b0920c389592ac840182ec8a882))

## 18.0.2

Fri, 27 Jan 2023 15:05:13 GMT

### Patches

- Create `setData()` function on the table rather than having a `data` property ([ni/nimble@f19bf61](https://github.com/ni/nimble/commit/f19bf610f46683eae4c80f2bdd5967d76e63124a))

## 18.0.1

Thu, 26 Jan 2023 19:17:59 GMT

### Patches

- Fix table row rendering on Safari ([ni/nimble@2e5a1c8](https://github.com/ni/nimble/commit/2e5a1c8875db2f230f49bc923d6126aba99200fe))

## 18.0.0

Thu, 26 Jan 2023 18:50:13 GMT

### Major changes

- Add 'beforetoggle' event on menu button and rename 'open-change' event to 'toggle'.
Update menu button to work when the slotted menu is nested within additional slots. ([ni/nimble@c39e8c8](https://github.com/ni/nimble/commit/c39e8c80af79ada2a696372c93161355187944af))

## 17.2.0

Tue, 24 Jan 2023 21:30:30 GMT

### Minor changes

- Add design tokens for additional spinner sizes, and update docs. ([ni/nimble@3c778c0](https://github.com/ni/nimble/commit/3c778c0a354dcc5883273ac62b7edd9a3dbed3cd))

## 17.1.0

Fri, 20 Jan 2023 22:27:00 GMT

### Minor changes

- Anchor tabs component ([ni/nimble@4c3c715](https://github.com/ni/nimble/commit/4c3c71571e92a5ca1ebc62a259c889cb90df710c))

## 17.0.8

Fri, 20 Jan 2023 10:47:22 GMT

### Patches

- Updated the WaferDie Interface to add an extra "tooltip" field ([ni/nimble@8fba3fd](https://github.com/ni/nimble/commit/8fba3fd7bf0ca6da7d6de9bcfbb0b817a1247b5c))

## 17.0.7

Thu, 19 Jan 2023 13:56:34 GMT

### Patches

- Fixed issues with rendering ([ni/nimble@47a5a0d](https://github.com/ni/nimble/commit/47a5a0d167c9d490791ff68c7f570161125cbc86))

## 17.0.6

Wed, 18 Jan 2023 21:20:08 GMT

### Patches

- Fix bug in table record ID logic ([ni/nimble@fa6aff9](https://github.com/ni/nimble/commit/fa6aff9024add0e848792001f85da2d4067054dd))

## 17.0.5

Wed, 18 Jan 2023 15:32:21 GMT

### Patches

- Fix menu background color on Color theme ([ni/nimble@5d2d985](https://github.com/ni/nimble/commit/5d2d985c73ccf41f7123593e41099569e619bab8))

## 17.0.4

Wed, 18 Jan 2023 14:55:24 GMT

### Patches

- Update table row styles ([ni/nimble@eaa3e67](https://github.com/ni/nimble/commit/eaa3e675766b5792343cf78f835cc8bc6a7d3986))

## 17.0.3

Sat, 14 Jan 2023 00:16:05 GMT

### Patches

- Introduce TableColumn and TableColumnText ([ni/nimble@86ea30b](https://github.com/ni/nimble/commit/86ea30bf6d6ed01cbe449f5ec67652b151d8d2a5))

## 17.0.2

Fri, 13 Jan 2023 07:16:01 GMT

### Patches

- Add zoom functionality to wafer map ([ni/nimble@61ae65c](https://github.com/ni/nimble/commit/61ae65cf7c5ce57cd17a1deb03bed1186a04a871))

## 17.0.1

Thu, 12 Jan 2023 15:29:47 GMT

### Patches

- Add ability to specify a field within the table's data to use as a row's ID ([ni/nimble@92c0e3f](https://github.com/ni/nimble/commit/92c0e3f70282e055d3d1742265567bb6e53b7b8d))

## 17.0.0

Wed, 11 Jan 2023 21:08:14 GMT

### Major changes

- Update box shadow tokens, including removing the 'popupBoxShadowColor' token. The 'popupBoxShadowColor' token has been replaced by elevation tokens. ([ni/nimble@14d2e7c](https://github.com/ni/nimble/commit/14d2e7ce92455bfca0e61c2956f50a32ef1f253d))

## 16.1.8

Wed, 11 Jan 2023 20:34:04 GMT

### Patches

- Update styleguide versions ([ni/nimble@d36bef4](https://github.com/ni/nimble/commit/d36bef4533df1908c92f4cb0e795ffb647bda627))
- Bump @ni/nimble-tokens to v4.3.2

## 16.1.7

Mon, 09 Jan 2023 23:44:20 GMT

### Patches

- Fix tab keyboard focus style ([ni/nimble@0d8fb2c](https://github.com/ni/nimble/commit/0d8fb2cd0ffe5d15254bba17b59d733ca11493c4))

## 16.1.6

Thu, 05 Jan 2023 18:31:08 GMT

### Patches

- Fix scrolling in the table ([ni/nimble@ac9e6c9](https://github.com/ni/nimble/commit/ac9e6c938436ccafae57842cc549c8c1ff183470))

## 16.1.5

Thu, 05 Jan 2023 16:41:38 GMT

### Patches

- Fixed the wafer-map resizing issues ([ni/nimble@01b31f4](https://github.com/ni/nimble/commit/01b31f49d75b8cc7ad3d8794fed4c9fd6d46ebb0))

## 16.1.4

Wed, 04 Jan 2023 21:51:15 GMT

### Patches

- Add rollup configuration to remove process.env.NODE_ENV ([ni/nimble@5a509a2](https://github.com/ni/nimble/commit/5a509a200990916575422b9c1e05d7cd1825331f))

## 16.1.3

Fri, 16 Dec 2022 21:11:13 GMT

### Patches

- Implement basic styling for nimble-table ([ni/nimble@48a9d51](https://github.com/ni/nimble/commit/48a9d514b129b37e1e3faa057c024e46e358fa3a))

## 16.1.2

Fri, 16 Dec 2022 18:41:04 GMT

### Patches

- create element for nimble-table-header ([ni/nimble@1328e1e](https://github.com/ni/nimble/commit/1328e1ed6c146b0537b4c5c46386d5c97a17052e))

## 16.1.1

Fri, 16 Dec 2022 15:11:41 GMT

### Patches

- - Update table template to include nimble-table-row and nimble-table-cell
 - Set the appropriate ARIA roles on nimble-table and sub elements ([ni/nimble@1700ba3](https://github.com/ni/nimble/commit/1700ba38c27d96d123d92084664ba5e7568232fe))

## 16.1.0

Fri, 16 Dec 2022 01:12:53 GMT

### Minor changes

- Spinner component ([ni/nimble@c50d9a2](https://github.com/ni/nimble/commit/c50d9a2e1934141b3a5dde98ceb84c8b992f1396))

## 16.0.0

Tue, 13 Dec 2022 22:11:51 GMT

### Major changes

- Implemented rendering module ([ni/nimble@8d11dc1](https://github.com/ni/nimble/commit/8d11dc1ff22a2b6d3c458359a419a4b930d738fd))

### Minor changes

- Anchor and Anchor Button components ([ni/nimble@ef1a9c5](https://github.com/ni/nimble/commit/ef1a9c554ad63d12a523436be7782b7d133dc19c))

### Patches

- Wafermap ensure rendering only happens after template construction ([ni/nimble@bb4bc33](https://github.com/ni/nimble/commit/bb4bc33dcd84cf3b50f21e47e4183eb80e4061e1))

## 15.5.8

Tue, 13 Dec 2022 19:56:22 GMT

### Patches

- - Implemented a seeded value generator for the dies (PR feedback) ([ni/nimble@4826bcb](https://github.com/ni/nimble/commit/4826bcb3e4264b76df212dc7757b568a07aa6218))

## 15.5.7

Mon, 12 Dec 2022 23:04:31 GMT

### Patches

- Changed wafer map rendering die opacity to rgba color alpha channel  ([ni/nimble@8a8410d](https://github.com/ni/nimble/commit/8a8410dcbef2a54463b0d4b4a4bc79b8a2b6792a))

## 15.5.6

Mon, 12 Dec 2022 18:13:52 GMT

### Patches

- Created render queue for wafer map component input changes ([ni/nimble@e70046b](https://github.com/ni/nimble/commit/e70046b7a09cd85253303ba5ec4bf2ab314c9c6d))

## 15.5.5

Fri, 09 Dec 2022 23:00:24 GMT

### Patches

- Basic TanStack integration with nimble-table ([ni/nimble@a4ce35d](https://github.com/ni/nimble/commit/a4ce35df8efd5b806cc0335b30a2c4764d470a8c))

## 15.5.4

Fri, 09 Dec 2022 11:25:00 GMT

### Patches

- Finished first iteration of the waferMap component and its storybook ([ni/nimble@001156d](https://github.com/ni/nimble/commit/001156d6c85f250a934ed8819b6a0650fe26eb84))

## 15.5.3

Wed, 07 Dec 2022 13:10:43 GMT

### Patches

- Created data manager module, prerendering functionality and modified some interface inputs ([ni/nimble@b7e946b](https://github.com/ni/nimble/commit/b7e946be21b68e6b871096ec587defd543d6ce32))

## 15.5.2

Mon, 05 Dec 2022 19:44:44 GMT

### Patches

- Initial code scaffolding for nimble-table component ([ni/nimble@d77ed48](https://github.com/ni/nimble/commit/d77ed4830b75ecc68c3049e8f67f3d9bd07b5257))

## 15.5.1

Tue, 29 Nov 2022 17:43:35 GMT

### Patches

- Finished first iteration of the waferMap component and its storybook ([ni/nimble@001156d](https://github.com/ni/nimble/commit/001156d6c85f250a934ed8819b6a0650fe26eb84))

## 15.5.0

Wed, 23 Nov 2022 16:47:02 GMT

### Minor changes

- Computations functionality added to the WaferMap component ([ni/nimble@4676381](https://github.com/ni/nimble/commit/4676381ff77c04f47d23b2f2c315af17cd364fca))

## 15.4.0

Tue, 22 Nov 2022 09:29:17 GMT

### Minor changes

- Create placeholder WaferMap component ([ni/nimble@ac82536](https://github.com/ni/nimble/commit/ac8253677461f3591b18f36ead547ec9d8562cb3))

## 15.3.2

Mon, 14 Nov 2022 23:02:04 GMT

### Patches

- Adjust control height based on label presence ([ni/nimble@e9d9aee](https://github.com/ni/nimble/commit/e9d9aeee9512e189e9219c7b57be04852b0b87f7))

## 15.3.1

Fri, 11 Nov 2022 15:34:20 GMT

### Patches

- Add fade animation to drawer when prefers-reduced-motion is enabled ([ni/nimble@e6b385e](https://github.com/ni/nimble/commit/e6b385ef6ec2590ba101de4fa7ef54c5be0d569d))

## 15.3.0

Fri, 11 Nov 2022 14:59:30 GMT

### Minor changes

- Added triangle-filled, check-large, and dot-solid-dot-stroke-measurement icons ([ni/nimble@e752021](https://github.com/ni/nimble/commit/e75202147b35ee50f80cc37890ca397e35dc019e))
- Bump @ni/nimble-tokens to v4.3.0

## 15.2.0

Thu, 10 Nov 2022 23:25:26 GMT

### Minor changes

- Update `typescript` version. ([ni/nimble@843d837](https://github.com/ni/nimble/commit/843d8373064ad8389b54fe72a1cedda4091a7b7f))
- Bump @ni/nimble-tokens to v4.2.0

## 15.1.1

Tue, 25 Oct 2022 13:53:36 GMT

### Patches

- Bump @ni/nimble-tokens to v4.1.3

## 15.1.0

Tue, 18 Oct 2022 16:53:38 GMT

### Minor changes

- Implement error state for select ([ni/nimble@14c474e](https://github.com/ni/nimble/commit/14c474efc7dd3f27d26ef7d977d1885019d58a95))

## 15.0.0

Fri, 07 Oct 2022 21:13:41 GMT

### Major changes

- Rename nimble "radio button" to "radio" ([ni/nimble@8f496f0](https://github.com/ni/nimble/commit/8f496f0aaca48e5765e942292c88e78094e81386))

## 14.0.0

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

## 13.0.0

Tue, 04 Oct 2022 16:41:24 GMT

### Major changes

- Fix issues related to nimble-drawer by rewriting the template to use the HTML dialog ([ni/nimble@e31785b](https://github.com/ni/nimble/commit/e31785bf51ac6d2e2d188ee3dceed3d862565d3e))

## 12.0.2

Mon, 03 Oct 2022 22:16:20 GMT

### Patches

- Updating licenses to MIT ([ni/nimble@31021de](https://github.com/ni/nimble/commit/31021de203162ed44452ab54425946b220cf9f0f))
- Bump @ni/nimble-tokens to v4.1.2

## 12.0.1

Thu, 29 Sep 2022 20:33:02 GMT

### Patches

- Bump @ni/nimble-tokens to v4.1.1

## 12.0.0

Thu, 29 Sep 2022 20:03:25 GMT

### Major changes

- Migrated from CSS classes to element attributes for configuring components. For the list of specific elements and classes changed see: [#738](https://github.com/ni/nimble/pull/738). ([ni/nimble@9023d71](https://github.com/ni/nimble/commit/9023d71ddb4740a624e5b9eac0114a0c91fbca78))

## 11.15.1

Mon, 19 Sep 2022 19:10:55 GMT

### Patches

- Turn off @typescript-eslint/indent for styles.ts files ([ni/nimble@c7509f7](https://github.com/ni/nimble/commit/c7509f7321c3cf635ba9f346026c4e097079aa5c))

## 11.15.0

Thu, 15 Sep 2022 18:33:47 GMT

### Minor changes

- Export Orientation enum so it can be used as value ([ni/nimble@a04abdb](https://github.com/ni/nimble/commit/a04abdb9c8f58af14565752920b09aa002e53173))

## 11.14.0

Mon, 12 Sep 2022 20:18:53 GMT

### Minor changes

- Add nimble-radio-button and nimble-radio-group ([ni/nimble@5a160ef](https://github.com/ni/nimble/commit/5a160efcf22098a21420834470a511878c81f387))

## 11.13.1

Tue, 06 Sep 2022 20:09:58 GMT

### Patches

- Fix minor animation issues and add guidelines for prefers-reduce-motion ([ni/nimble@7b4a4f1](https://github.com/ni/nimble/commit/7b4a4f1b6b87bff5967ba9c7ce8dbabac9c2d33a))

## 11.13.0

Fri, 02 Sep 2022 17:48:33 GMT

### Minor changes

- Change backdrop overlay color for dialog and drawer ([ni/nimble@29a0456](https://github.com/ni/nimble/commit/29a0456ac99235f13cf5d09c5d0085a14da53661))

## 11.12.1

Tue, 30 Aug 2022 19:03:18 GMT

### Patches

- update nimble logos ([ni/nimble@96b2413](https://github.com/ni/nimble/commit/96b2413d2cec7cdf9a4a848ecbd7de6358ea2caa))

## 11.12.0

Tue, 30 Aug 2022 18:14:50 GMT

### Minor changes

- Adding USER_DISMISSED to Dialog class and avoid stale cached value ([ni/nimble@891b62c](https://github.com/ni/nimble/commit/891b62c4f672b51f6a3c82e77a428a59763bd09c))

## 11.11.0

Fri, 26 Aug 2022 14:00:36 GMT

### Minor changes

- Added IconBookMagnifyingGlass, IconCircleFilled, IconCloud, IconShareNodes, IconThreeVerticalLines icons ([ni/nimble@75b48c2](https://github.com/ni/nimble/commit/75b48c20131c2ac891ac50a766d9c3fb88c50718))
- Bump @ni/nimble-tokens to v4.1.0

## 11.10.6

Wed, 24 Aug 2022 22:18:14 GMT

### Patches

- Use correct colors in nimble-card-button on Color UI ([ni/nimble@f375ba9](https://github.com/ni/nimble/commit/f375ba91d4e19bd24b66a6f1d5393dd6c3a9f997))

## 11.10.5

Wed, 17 Aug 2022 18:59:48 GMT

### Patches

- Add token previews to storybook ([ni/nimble@bc7262c](https://github.com/ni/nimble/commit/bc7262c578faf4af964fba4d63a92445703ed2da))

## 11.10.4

Mon, 15 Aug 2022 15:50:12 GMT

### Patches

- Simple style change to support font-style ([ni/nimble@4753667](https://github.com/ni/nimble/commit/475366789d09c01b902a97f795b91e70a54b3efb))

## 11.10.3

Fri, 12 Aug 2022 19:14:22 GMT

### Patches

- Replicating updated design tokens ([ni/nimble@f293311](https://github.com/ni/nimble/commit/f2933114b1b89a3c8cdae5d26d4a4779e1972596))

## 11.10.2

Thu, 11 Aug 2022 22:20:09 GMT

### Patches

- Remove delegatesFocus from dialog ([ni/nimble@ab34f42](https://github.com/ni/nimble/commit/ab34f42e9602c20bef3fa3b49a8d82630aeca880))

## 11.10.1

Thu, 11 Aug 2022 20:28:40 GMT

### Patches

- Specify tslib version ([ni/nimble@7858f31](https://github.com/ni/nimble/commit/7858f3155a4f9f774e79bc303641b39d7a05f1f9))

## 11.10.0

Wed, 10 Aug 2022 21:38:38 GMT

### Minor changes

- Add Appearance to Combobox. ([ni/nimble@32b4ed9](https://github.com/ni/nimble/commit/32b4ed97aaaea52ff211118a405fd34922a3c0cd))

## 11.9.0

Wed, 10 Aug 2022 17:05:04 GMT

### Minor changes

- Add nimble-dialog component ([ni/nimble@fd2f531](https://github.com/ni/nimble/commit/fd2f53162c9d194b943f8573eb140539eb0eccbc))

## 11.8.5

Tue, 09 Aug 2022 22:19:14 GMT

### Patches

- Combobox text input updates value. ([ni/nimble@f232213](https://github.com/ni/nimble/commit/f232213f3f0078a7a97879e2fd8f49937e14eef4))

## 11.8.4

Tue, 09 Aug 2022 18:05:33 GMT

### Patches

- Remove custom text selection styling ([ni/nimble@fd627f2](https://github.com/ni/nimble/commit/fd627f21dee853ce1e6d77196c673f28d58e2daa))

## 11.8.3

Tue, 09 Aug 2022 15:57:14 GMT

### Patches

- Remove tab focus from button in combobox. ([ni/nimble@56ee1ee](https://github.com/ni/nimble/commit/56ee1eeb21568b86a6e5b351d1f1985e23d228dc))

## 11.8.2

Tue, 09 Aug 2022 00:07:50 GMT

### Patches

- theme and appearance behaviors refactor ([ni/nimble@9a2f491](https://github.com/ni/nimble/commit/9a2f49176f39b5e9027486b89a9a910f7a68f454))

## 11.8.1

Mon, 01 Aug 2022 17:54:58 GMT

### Patches

- Fix focus styling on breadcrumb items ([ni/nimble@056605c](https://github.com/ni/nimble/commit/056605c8deebb7dba01bbac1a86dd0a1d670c5e3))

## 11.8.0

Thu, 28 Jul 2022 21:21:12 GMT

### Minor changes

- Create nimble-card-button component ([ni/nimble@00c328d](https://github.com/ni/nimble/commit/00c328dcae2cdaa93505cfe81e92d7019e34423b))

## 11.7.2

Thu, 28 Jul 2022 20:37:04 GMT

### Patches

- Bump @ni/nimble-tokens to v4.0.1

## 11.7.1

Wed, 27 Jul 2022 15:38:00 GMT

### Patches

- Update fast-foundation. ([ni/nimble@8b1dc12](https://github.com/ni/nimble/commit/8b1dc127df77135a98f0a954b16337c718849c30))

## 11.7.0

Wed, 27 Jul 2022 00:53:31 GMT

### Minor changes

- Implementation of the different states of the Nimble Tooltip. ([ni/nimble@5142136](https://github.com/ni/nimble/commit/5142136ea7753d4a71c7047c86fdc05bab2ed66f))

## 11.6.2

Mon, 25 Jul 2022 18:44:33 GMT

### Patches

- Adding option to Combobox Storybook. Fix styling for empty options. ([ni/nimble@9039cd2](https://github.com/ni/nimble/commit/9039cd29ed7223123aa7b3a09ac5ee90ec2c388a))

## 11.6.1

Fri, 22 Jul 2022 14:58:44 GMT

### Patches

- Minor style fix to combobox. Resolves #639. ([ni/nimble@ea1854a](https://github.com/ni/nimble/commit/ea1854aba1c043971e9348b39e6f525b0456a10a))

## 11.6.0

Wed, 20 Jul 2022 18:41:04 GMT

### Minor changes

- adding block and outline appearances to select ([ni/nimble@a188d7b](https://github.com/ni/nimble/commit/a188d7baa54e1061ad07ffa65b0e5d0a2b495238))

## 11.5.0

Mon, 18 Jul 2022 15:25:53 GMT

### Minor changes

- Adding invalid state support to number field ([ni/nimble@7dcb1af](https://github.com/ni/nimble/commit/7dcb1af22c1827320b2516e9b967830f3295e86a))

## 11.4.1

Fri, 15 Jul 2022 21:12:50 GMT

### Patches

- Fix icon colors for the Color theme.(#629) ([ni/nimble@aa729cc](https://github.com/ni/nimble/commit/aa729cc29ca4969f14f4ab9313c3abdac2c8b248))

## 11.4.0

Mon, 27 Jun 2022 17:17:28 GMT

### Minor changes

- New token for divider background color ([ni/nimble@12ed391](https://github.com/ni/nimble/commit/12ed391e04e9bdaac550d401704d54e0b6a10e83))

## 11.3.0

Fri, 24 Jun 2022 15:18:24 GMT

### Minor changes

- Implementation, styling, and tests for the 'default' state of the nimble-tooltip. ([ni/nimble@70e8d55](https://github.com/ni/nimble/commit/70e8d554250b8abc4ce7bdc069dcbf28107fee7c))

## 11.2.0

Thu, 23 Jun 2022 18:40:01 GMT

### Minor changes

- Add appearances and update inc/dec for number field ([ni/nimble@2678f74](https://github.com/ni/nimble/commit/2678f7470e090ed20520a4cd98fc07a8c2ab995b))

## 11.1.1

Mon, 20 Jun 2022 23:17:47 GMT

### Patches

- Restore animation growing from center ([ni/nimble@bb4b2b4](https://github.com/ni/nimble/commit/bb4b2b405cacb7960714617c8863fbdbb6fb2d74))

## 11.1.0

Mon, 20 Jun 2022 20:39:36 GMT

### Minor changes

- Add Combobox component ([ni/nimble@d6af9e7](https://github.com/ni/nimble/commit/d6af9e70b1058f46e6726f1caf22092523a0ff24))

## 11.0.4

Thu, 16 Jun 2022 18:11:31 GMT

### Patches

- Fix bug where menu-button could accidentally hide the button's content ([ni/nimble@74a9b60](https://github.com/ni/nimble/commit/74a9b600ec41d4a0372dfe863f0ee5705c65aafb))

## 11.0.3

Wed, 15 Jun 2022 19:12:55 GMT

### Patches

- Keyboard focus styling for select ([ni/nimble@3a3780e](https://github.com/ni/nimble/commit/3a3780e4676fd32ff9d89c0ed7c455c1ce0f6f81))

## 11.0.2

Mon, 13 Jun 2022 22:34:57 GMT

### Patches

- Text/Number fields hover indicator grows from middle ([ni/nimble@c930471](https://github.com/ni/nimble/commit/c930471568477d0b665ce9039cd13a73511b5c8e))

## 11.0.1

Tue, 07 Jun 2022 15:43:41 GMT

### Patches

- Fix select drop-down clipping ([ni/nimble@c7a0202](https://github.com/ni/nimble/commit/c7a0202b1f1980159f9e14cbac69e6172ccec075))

## 11.0.0

Thu, 02 Jun 2022 15:11:56 GMT

### Major changes

- Icon names updated from the postfix nimble-*-icon to the prefix nimble-icon-*. ([ni/nimble@7d7416e](https://github.com/ni/nimble/commit/7d7416ecb6f539feed219221c905b7365c8c7f79))

## 10.0.9

Tue, 31 May 2022 17:03:58 GMT

### Patches

- Use new nimble-token icon paths. See nimble-tokens changes if using fonts.css directly from nimble-tokens. ([ni/nimble@eeb6783](https://github.com/ni/nimble/commit/eeb6783dd96e74365350826b44592c403ef8376d))
- Bump @ni/nimble-tokens to v4.0.0

## 10.0.8

Fri, 27 May 2022 15:39:30 GMT

### Patches

- Bump @ni/nimble-tokens to v3.2.4

## 10.0.7

Mon, 23 May 2022 21:59:32 GMT

### Patches

- Bump @ni/nimble-tokens to v3.2.3

## 10.0.6

Mon, 23 May 2022 19:28:21 GMT

### Patches

- Bump @ni/nimble-tokens to v3.2.2

## 10.0.5

Mon, 23 May 2022 17:08:16 GMT

### Patches

- Export nimble-menu-button from all-components ([ni/nimble@717f2fb](https://github.com/ni/nimble/commit/717f2fbd251509bb8deee23c842dceb5c4325c84))

## 10.0.4

Mon, 23 May 2022 15:27:37 GMT

### Patches

- Fix icon opacity for disabled buttons ([ni/nimble@977fb31](https://github.com/ni/nimble/commit/977fb31dfaffefbd30bf142eaa5a8f37e2ef6041))

## 10.0.3

Wed, 18 May 2022 22:20:28 GMT

### Patches

- Focus menu-button in capture phase of event handler ([ni/nimble@382b7be](https://github.com/ni/nimble/commit/382b7bec724966de8edc356a453783861aaa560d))

## 10.0.2

Wed, 18 May 2022 20:52:01 GMT

### Patches

- Remove unused dist output ([ni/nimble@d6fdd7c](https://github.com/ni/nimble/commit/d6fdd7ce77c264d72f885b2a734a692dc1938e71))
- Bump @ni/nimble-tokens to v3.2.1

## 10.0.1

Wed, 18 May 2022 20:19:53 GMT

### Patches

- Update dark theme token value for header background color ([ni/nimble@93810d5](https://github.com/ni/nimble/commit/93810d5d61bdff39451918bbc4a463db57505e27))

## 10.0.0

Wed, 18 May 2022 19:45:57 GMT

### Major changes

- 1. Rename enum options to use camelCase instead of PascalCase to improve API consistency.
2. change all enums to use const object and string union pattern.
3. Renamed string unions named `*Attribute` to remove the word `Attribute`. ([ni/nimble@1626a16](https://github.com/ni/nimble/commit/1626a16c850dd5f47a6e05d23f2829a56a634554))

## 9.0.4

Tue, 17 May 2022 22:28:41 GMT

### Patches

- Update import/formatting of tokens SCSS ([ni/nimble@c254c00](https://github.com/ni/nimble/commit/c254c00cda2686d3f0eb872d961a8847fa571c10))

## 9.0.3

Tue, 17 May 2022 16:02:58 GMT

### Patches

- No longer require clients to manually import nimble-toggle-button and nimble-anchored-region when using nimble-menu-button ([ni/nimble@e7a22c8](https://github.com/ni/nimble/commit/e7a22c8fc760f51ebc0d7e56d564576628776456))

## 9.0.2

Tue, 17 May 2022 15:15:50 GMT

### Patches

- Support submenus in nimble-menu ([ni/nimble@6d709f5](https://github.com/ni/nimble/commit/6d709f50703d92fe285229f24e809bcbba84a8c6))

## 9.0.1

Mon, 16 May 2022 22:54:32 GMT

### Patches

- Avoid disabled text field ellipsized text overflow bug ([ni/nimble@ec41017](https://github.com/ni/nimble/commit/ec410175429ce61496f554dde33245c2ed5bb917))

## 9.0.0

Thu, 12 May 2022 18:39:55 GMT

### Major changes

- Fix drawer footer layout on Safari. Clients providing the drawer a header, section, and footer must now provide them in that order. They will be displayed in the order given ([ni/nimble@0413ad2](https://github.com/ni/nimble/commit/0413ad227ca26c4798f9551a43481220f3a08852))

## 8.6.3

Thu, 12 May 2022 18:16:13 GMT

### Patches

- Fix a few cosmetic issues with tabs ([ni/nimble@a85233a](https://github.com/ni/nimble/commit/a85233a89ca31819e5861044d6c7af240db33933))

## 8.6.2

Tue, 10 May 2022 21:09:37 GMT

### Patches

- Update FAST dependency versions ([ni/nimble@765f2f5](https://github.com/ni/nimble/commit/765f2f5f4cd28592e16e163e0d4e4afa9a87b9a7))

## 8.6.1

Tue, 10 May 2022 20:40:12 GMT

### Patches

- Use LargeDelay token ([ni/nimble@54618fa](https://github.com/ni/nimble/commit/54618faeb76695e0480cb94c558d0818fa77ded8))
- Bump @ni/nimble-tokens to v3.2.0

## 8.6.0

Tue, 10 May 2022 19:19:34 GMT

### Minor changes

- Create nimble-menu-button component ([ni/nimble@c4bb268](https://github.com/ni/nimble/commit/c4bb26837c1b6570d2dd8d09597a90d6f8eaf34c))

## 8.5.0

Mon, 09 May 2022 16:30:15 GMT

### Minor changes

- Support clear-inline-padding class on frameless text field ([ni/nimble@9cd7e2b](https://github.com/ni/nimble/commit/9cd7e2b65f2c110358ea840e35791f9b45483968))

## 8.4.0

Wed, 04 May 2022 21:26:02 GMT

### Minor changes

- Create nimble-anchored-region ([ni/nimble@653341a](https://github.com/ni/nimble/commit/653341a69d93c7e4aaf09e601962bca50aec0967))

## 8.3.0

Mon, 02 May 2022 21:17:05 GMT

### Minor changes

- Added mousedown fill color ([ni/nimble@8221a0c](https://github.com/ni/nimble/commit/8221a0c79dde412326b2358add1a521894035e75))

## 8.2.1

Fri, 29 Apr 2022 20:41:59 GMT

### Patches

- Reflect ARIA attributes from toggle-button onto inner control ([ni/nimble@9ffe14d](https://github.com/ni/nimble/commit/9ffe14dc5c32a24e60b0a8b1e1db44a331af1350))

## 8.2.0

Fri, 29 Apr 2022 19:30:37 GMT

### Minor changes

- Show start slot on text field ([ni/nimble@f3f3545](https://github.com/ni/nimble/commit/f3f35459c1bf71a433c5b892803a01b129155f4a))

## 8.1.11

Fri, 29 Apr 2022 15:27:01 GMT

### Patches

- Bump @ni/nimble-tokens to v3.1.0

## 8.1.10

Sat, 23 Apr 2022 05:05:02 GMT

### Patches

- Bump @ni/nimble-tokens to v3.0.13

## 8.1.9

Sat, 23 Apr 2022 04:31:01 GMT

### Patches

- Bump @ni/nimble-tokens to v3.0.12

## 8.1.8

Sat, 23 Apr 2022 04:15:08 GMT

### Patches

- Bump @ni/nimble-tokens to v3.0.11

## 8.1.4

Fri, 22 Apr 2022 22:36:24 GMT

### Patches

- Bump @ni/nimble-tokens to v3.0.7

## 8.1.3

Fri, 22 Apr 2022 16:09:27 GMT

### Patches

- Bump @ni/nimble-tokens to v3.0.6

## 8.1.2

Fri, 22 Apr 2022 15:09:11 GMT

### Patches

- Bump @ni/nimble-tokens to v3.0.4

## 8.1.1

Fri, 22 Apr 2022 14:26:36 GMT

### Patches

- Bump @ni/nimble-tokens to v3.0.3

## 8.1.0

Fri, 22 Apr 2022 12:45:44 GMT

### Minor changes

- Add frameless appearance to nimble-text-field (7282195+m-akinc@users.noreply.github.com)

## 8.0.2

Thu, 21 Apr 2022 20:57:24 GMT

### Patches

- Fix minified source map generation (rajsite@users.noreply.github.com)
- Bump @ni/nimble-tokens to v3.0.2

## 8.0.1

Wed, 13 Apr 2022 23:09:34 GMT

### Patches

- Enforce tree selection mode when using keyboard (20542556+mollykreis@users.noreply.github.com)

## 8.0.0

Wed, 13 Apr 2022 21:55:47 GMT

### Major changes

- Changing nimble-listbox-option to nimble-list-option (26874831+atmgrifter00@users.noreply.github.com)

## 7.8.3

Wed, 13 Apr 2022 20:50:06 GMT

### Patches

- Adding nimble toolbar to allComponents (26874831+atmgrifter00@users.noreply.github.com)

## 7.8.2

Tue, 12 Apr 2022 19:28:50 GMT

### Patches

- Remove nested specific styling from tree items (20542556+mollykreis@users.noreply.github.com)

## 7.8.1

Tue, 12 Apr 2022 18:29:27 GMT

### Patches

- Correct hover color of active tree group (20542556+mollykreis@users.noreply.github.com)

## 7.8.0

Mon, 11 Apr 2022 21:45:54 GMT

### Minor changes

- Add 'none' selection mode to tree (20542556+mollykreis@users.noreply.github.com)

## 7.7.0

Thu, 07 Apr 2022 19:57:34 GMT

### Minor changes

- Add styling for indeterminate checkbox state (7282195+m-akinc@users.noreply.github.com)

## 7.6.0

Wed, 06 Apr 2022 19:38:49 GMT

### Minor changes

- nimble-drawer has cancelable 'cancel' event (triggered when dimming overlay is clicked, when modal = true) (20709258+msmithNI@users.noreply.github.com)

## 7.5.0

Fri, 01 Apr 2022 18:39:28 GMT

### Minor changes

- Add ability to place buttons within a text field (20542556+mollykreis@users.noreply.github.com)

## 7.4.3

Thu, 31 Mar 2022 21:02:24 GMT

### Patches

- nimble-text-area honor height and width (7282195+m-akinc@users.noreply.github.com)

## 7.4.2

Thu, 31 Mar 2022 18:58:20 GMT

### Patches

- Added descriptive tags to icon metadata file (1458528+fredvisser@users.noreply.github.com)

## 7.4.1

Thu, 31 Mar 2022 18:03:04 GMT

### Patches

- Fix bug in nimble-select when options change (20542556+mollykreis@users.noreply.github.com)

## 7.4.0

Thu, 24 Mar 2022 01:16:17 GMT

### Minor changes

- Add bundled distribution file to package (5454342+brianehenry@users.noreply.github.com)

## 7.3.0

Wed, 23 Mar 2022 18:49:06 GMT

### Minor changes

- Create nimble-toolbar component (20542556+mollykreis@users.noreply.github.com)

## 7.2.3

Tue, 22 Mar 2022 20:59:12 GMT

### Patches

- Update FAST dependencies. Fix issues. (26874831+atmgrifter00@users.noreply.github.com)

## 7.2.2

Fri, 18 Mar 2022 19:18:02 GMT

### Patches

- Fix button width and height styles (20542556+mollykreis@users.noreply.github.com)

## 7.2.1

Wed, 16 Mar 2022 22:20:10 GMT

### Patches

- Fix hover style of block button (20542556+mollykreis@users.noreply.github.com)

## 7.2.0

Wed, 16 Mar 2022 21:51:34 GMT

### Minor changes

- Add support for icons in 'end' slot of nimble-button and nimble-toggle-button (20542556+mollykreis@users.noreply.github.com)

## 7.1.1

Wed, 16 Mar 2022 18:56:43 GMT

### Patches

- Icon button use hidden content as a11y name (7282195+m-akinc@users.noreply.github.com)

## 7.1.0

Mon, 14 Mar 2022 16:43:20 GMT

### Minor changes

- Create switch component (5454342+brianehenry@users.noreply.github.com)

## 7.0.1

Fri, 11 Mar 2022 16:23:10 GMT

### Patches

- Switch to released 6.0.0 of storybook-addon-xd-designs (7282195+m-akinc@users.noreply.github.com)

## 7.0.0

Fri, 11 Mar 2022 00:51:41 GMT

### Major changes

- Change nimble-breadcrumb CSS class from "style-2" to "prominent-links" (to get alt link color style); add that style to breadcrumb theme matrix (20709258+msmithNI@users.noreply.github.com)

## 6.1.5

Thu, 10 Mar 2022 19:42:54 GMT

### Patches

- Fix bug where incorrect theme can be applied to breadcrumb/textfield if 2 theme providers/ themes are active on a page (20709258+msmithNI@users.noreply.github.com)

## 6.1.4

Wed, 09 Mar 2022 22:20:03 GMT

### Patches

- Bump @ni/nimble-tokens to v3.0.1

## 6.1.3

Tue, 08 Mar 2022 16:17:42 GMT

### Patches

- Inherit font properties from nimble-text-field element (7282195+m-akinc@users.noreply.github.com)

## 6.1.2

Fri, 04 Mar 2022 21:15:36 GMT

### Patches

- Add final styling for breadcrumb. nimble-breadcrumb allows swapping to 2nd style (swaps link regular/mousedown colors) via style-2 CSS class. (20709258+msmithNI@users.noreply.github.com)

## 6.1.1

Fri, 04 Mar 2022 20:46:39 GMT

### Patches

- Don't tie error display to invalid state (7282195+m-akinc@users.noreply.github.com)

## 6.1.0

Wed, 02 Mar 2022 17:00:45 GMT

### Minor changes

- Adding new font tokens (26874831+atmgrifter00@users.noreply.github.com)

## 6.0.0

Tue, 01 Mar 2022 19:24:47 GMT

### Major changes

- Rename text field attribute from errortext to error-text (7282195+m-akinc@users.noreply.github.com)

## 5.0.1

Tue, 01 Mar 2022 18:23:44 GMT

### Patches

- Initialize properties for nimble owned properties like appearance modes and theme provider. (rajsite@users.noreply.github.com)

## 5.0.0

Tue, 01 Mar 2022 16:07:33 GMT

### Major changes

- Renamed fillHoverSelectedColor & fillSelectedColor tokens. (1458528+fredvisser@users.noreply.github.com)
- Bump @ni/nimble-tokens to v3.0.0

## 4.1.0

Tue, 01 Mar 2022 15:14:49 GMT

### Minor changes

- Support error text on nimble-text-field (7282195+m-akinc@users.noreply.github.com)

## 4.0.1

Thu, 24 Feb 2022 19:17:00 GMT

### Patches

- Use correct padding in select component (20542556+mollykreis@users.noreply.github.com)

## 4.0.0

Thu, 24 Feb 2022 16:20:16 GMT

### Major changes

- Added icons, [updated names](https://nio365-my.sharepoint.com/:x:/g/personal/fred_visser_ni_com/EXICQZuUaOBHiJEj7G55E0EBsLshTmfYM6TIfAKD5Jo7bA?e=fucw97) of existing icons, implemented code generation for icons (5454342+brianehenry@users.noreply.github.com)

## 3.2.0

Wed, 23 Feb 2022 22:30:22 GMT

### Minor changes

- Add new nimble-breadcrumb and nimble-breadcrumb-item components (20709258+msmithNI@users.noreply.github.com)

## 3.1.0

Wed, 23 Feb 2022 22:01:52 GMT

### Minor changes

- Implement primary buttons (20542556+mollykreis@users.noreply.github.com)

## 3.0.0

Wed, 23 Feb 2022 20:10:44 GMT

### Major changes

- Refactored nearly all theme-aware tokens. See this [spreadsheet](https://nio365-my.sharepoint.com/:x:/g/personal/fred_visser_ni_com/EXICQZuUaOBHiJEj7G55E0EBsLshTmfYM6TIfAKD5Jo7bA?e=fucw97) for a mapping of old and new tokens. (1458528+fredvisser@users.noreply.github.com)
- Bump @ni/nimble-tokens to v2.1.0

## 2.1.3

Mon, 21 Feb 2022 23:14:18 GMT

### Patches

- Fix minor hover issue for text area on Safari (7282195+m-akinc@users.noreply.github.com)

## 2.1.2

Mon, 21 Feb 2022 15:34:13 GMT

### Patches

- Updating with [renamed](https://nio365-my.sharepoint.com/:x:/g/personal/fred_visser_ni_com/EXICQZuUaOBHiJEj7G55E0EBsLshTmfYM6TIfAKD5Jo7bA?e=fucw97) icons from nimble-tokens (1458528+fredvisser@users.noreply.github.com)
- Bump @ni/nimble-tokens to v2.0.0

## 2.1.1

Sat, 19 Feb 2022 00:06:17 GMT

### Patches

- Bump @ni/nimble-tokens to v1.1.0

## 2.1.0

Thu, 17 Feb 2022 19:43:53 GMT

### Minor changes

- Implement nimble-text-area component (7282195+m-akinc@users.noreply.github.com)

## 2.0.2

Thu, 17 Feb 2022 17:30:49 GMT

### Patches

- Update readonly text field style (7282195+m-akinc@users.noreply.github.com)

## 2.0.1

Thu, 17 Feb 2022 03:15:59 GMT

### Patches

- Fix focus bug with nimble-toggle-button (20542556+mollykreis@users.noreply.github.com)

## 2.0.0

Tue, 15 Feb 2022 17:32:39 GMT

### Major changes

- remove legacy blue (1458528+fredvisser@users.noreply.github.com)

## 1.2.0

Mon, 14 Feb 2022 21:34:16 GMT

### Minor changes

- Add additional Outline and Block text field appearances (7282195+m-akinc@users.noreply.github.com)

## 1.1.2

Mon, 14 Feb 2022 18:58:21 GMT

### Patches

- add max-height for select menu (1458528+fredvisser@users.noreply.github.com)

## 1.1.1

Fri, 11 Feb 2022 16:48:53 GMT

### Patches

- FAST version update (rajsite@users.noreply.github.com)

## 1.1.0

Tue, 08 Feb 2022 22:38:10 GMT

### Minor changes

- Create nimble-toggle-button (20542556+mollykreis@users.noreply.github.com)

## 1.0.0

Mon, 07 Feb 2022 18:48:57 GMT

### Patches

- Remove 'beta' tag from package to start using semantic versioning (jattasNI@users.noreply.github.com)
- Bump @ni/nimble-tokens to v1.0.0

## 1.0.0-beta.129

Fri, 04 Feb 2022 23:44:50 GMT

### Changes

- ThemeStyleSheetBehavior implmentation
- **Breaking change**: NimbleThemeProvider renamed to ThemeProvider. NimbleTheme renamed to Theme. Removed passwordRevealFilter design token. (rajsite@users.noreply.github.com)

## 1.0.0-beta.128

Wed, 02 Feb 2022 16:29:26 GMT

### Changes

- Add status icon components (32167177+haworthia@users.noreply.github.com)

## 1.0.0-beta.127

Tue, 01 Feb 2022 17:09:06 GMT

### Changes

- Bump @ni/nimble-tokens to v1.0.0-beta.39

## 1.0.0-beta.126

Fri, 28 Jan 2022 21:45:26 GMT

### Changes

- Theme-aware token scss file generation.
 - Users should switch from CSS properties to SCSS properties so any token changes during upgrades can be detected at build time.
 - **Breaking change**: Theme-aware CSS custom properties now have prefix --ni-nimble-*. (rajsite@users.noreply.github.com)

## 1.0.0-beta.125

Thu, 20 Jan 2022 21:30:14 GMT

### Changes

- Remove default slot from Nimble icons. This is a breaking change. Clients using Nimble icons inside Nimble buttons, menu items, or tree items must now explicitly set the 'slot' attribute on those icons to 'start' in order for them to be styled properly. (7282195+m-akinc@users.noreply.github.com)

## 1.0.0-beta.124

Thu, 20 Jan 2022 04:13:54 GMT

### Changes

- Add contentHidden attribute to button rather than implicitly determine a button has no text content (20542556+mollykreis@users.noreply.github.com)

## 1.0.0-beta.123

Wed, 19 Jan 2022 23:57:51 GMT

### Changes

- Documentation of theming system (jattasNI@users.noreply.github.com)
- Bump @ni/nimble-tokens to v1.0.0-beta.38

## 1.0.0-beta.122

Thu, 13 Jan 2022 19:48:52 GMT

### Changes

- Bump @ni/nimble-tokens to v1.0.0-beta.37

## 1.0.0-beta.121

Wed, 12 Jan 2022 19:57:11 GMT

### Changes

- Increase test cases covered by button matrix stories (20542556+mollykreis@users.noreply.github.com)

## 1.0.0-beta.120

Tue, 11 Jan 2022 22:03:36 GMT

### Changes

- Correct styling of icon buttons (20542556+mollykreis@users.noreply.github.com)

## 1.0.0-beta.119

Mon, 10 Jan 2022 18:14:33 GMT

### Changes

- Turn on strict type checking and resolve violations (7282195+m-akinc@users.noreply.github.com)

## 1.0.0-beta.118

Fri, 07 Jan 2022 00:04:56 GMT

### Changes

- Add baseClass in call to compose for Button and Select (7282195+m-akinc@users.noreply.github.com)

## 1.0.0-beta.117

Thu, 06 Jan 2022 23:21:51 GMT

### Changes

- Don't hardcode nimble-listbox-option in query (7282195+m-akinc@users.noreply.github.com)

## 1.0.0-beta.116

Thu, 06 Jan 2022 19:28:47 GMT

### Changes

- Refactor prefers-reduced-motion watching logic into utility (7282195+m-akinc@users.noreply.github.com)

## 1.0.0-beta.115

Fri, 17 Dec 2021 22:32:22 GMT

### Changes

- Update versions of @ni/javascript-styleguide dependencies (jattasNI@users.noreply.github.com)
- Bump @ni/nimble-tokens to v1.0.0-beta.36

## 1.0.0-beta.114

Wed, 15 Dec 2021 20:22:01 GMT

### Changes

- Add HTMLElementTagNameMap extensions for Nimble elements (5454342+brianehenry@users.noreply.github.com)

## 1.0.0-beta.113

Tue, 14 Dec 2021 04:09:05 GMT

### Changes

- Re-export FAST's DOM.processUpdates method (5454342+brianehenry@users.noreply.github.com)

## 1.0.0-beta.112

Mon, 13 Dec 2021 20:30:22 GMT

### Changes

- Directive attribute string support and type export (rajsite@users.noreply.github.com)

## 1.0.0-beta.111

Mon, 13 Dec 2021 14:41:26 GMT

### Changes

- Use legacy font family var in legacy theme (5454342+brianehenry@users.noreply.github.com)

## 1.0.0-beta.110

Fri, 10 Dec 2021 16:32:53 GMT

### Changes

- Improve usage docs for nimble-components (jattasNI@users.noreply.github.com)

## 1.0.0-beta.109

Thu, 09 Dec 2021 20:35:29 GMT

### Changes

- Update publish command (rajsite@users.noreply.github.com)
- Bump @ni/nimble-tokens to v1.0.0-beta.35

## 1.0.0-beta.108

Wed, 08 Dec 2021 00:40:11 GMT

### Changes

- Update TreeItem to prevent future breakage (26874831+atmgrifter00@users.noreply.github.com)

## 1.0.0-beta.107

Tue, 07 Dec 2021 16:36:46 GMT

### Changes

- Add Roboto font and token for legacy content font (5454342+brianehenry@users.noreply.github.com)
- Bump @ni/nimble-tokens to v1.0.0-beta.34

## 1.0.0-beta.106

Mon, 06 Dec 2021 19:56:32 GMT

### Changes

- upgrade to 6.4 final (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.105

Fri, 03 Dec 2021 20:54:09 GMT

### Changes

- Drawer updates (bugfix for content/footer mode, make drawer width configurable in Storybook) (20709258+msmithNI@users.noreply.github.com)

## 1.0.0-beta.104

Fri, 03 Dec 2021 18:58:22 GMT

### Changes

- Add icons for succeeded and fail (32167177+haworthia@users.noreply.github.com)

## 1.0.0-beta.103

Wed, 01 Dec 2021 17:51:36 GMT

### Changes

- Bump @ni/nimble-tokens to v1.0.0-beta.33

## 1.0.0-beta.102

Wed, 01 Dec 2021 15:38:13 GMT

### Changes

- Bump @ni/nimble-tokens to v1.0.0-beta.32

## 1.0.0-beta.101

Mon, 29 Nov 2021 20:17:04 GMT

### Changes

- Update documentation (jattasNI@users.noreply.github.com)
- Bump @ni/nimble-tokens to v1.0.0-beta.31

## 1.0.0-beta.100

Mon, 29 Nov 2021 19:31:25 GMT

### Changes

- Bump @ni/nimble-tokens to v1.0.0-beta.30

## 1.0.0-beta.99

Tue, 23 Nov 2021 01:46:37 GMT

### Changes

- Bump @ni/nimble-tokens to v1.0.0-beta.29

## 1.0.0-beta.98

Tue, 23 Nov 2021 01:15:54 GMT

### Changes

- Bump @ni/nimble-tokens to v1.0.0-beta.28

## 1.0.0-beta.97

Tue, 23 Nov 2021 00:41:11 GMT

### Changes

- Bump @ni/nimble-tokens to v1.0.0-beta.27

## 1.0.0-beta.96

Tue, 23 Nov 2021 00:23:48 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.96 (rajsite@users.noreply.github.com)

## 1.0.0-beta.95

Tue, 23 Nov 2021 00:05:58 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.95 (rajsite@users.noreply.github.com)

## 1.0.0-beta.94

Mon, 22 Nov 2021 21:49:37 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.94 (rajsite@users.noreply.github.com)

## 1.0.0-beta.93

Mon, 22 Nov 2021 20:29:22 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.93 (rajsite@users.noreply.github.com)

## 1.0.0-beta.92

Fri, 19 Nov 2021 16:42:10 GMT

### Changes

- Make hidden styling consistent (5454342+brianehenry@users.noreply.github.com)

## 1.0.0-beta.91

Wed, 10 Nov 2021 17:31:11 GMT

### Changes

- update DSP from XD and change logo (1458528+fredvisser@users.noreply.github.com)
- Bump @ni/nimble-components to v1.0.0-beta.91 (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.90

Tue, 02 Nov 2021 14:46:47 GMT

### Changes

- updated component docs (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.89

Wed, 27 Oct 2021 16:30:36 GMT

### Changes

- Drawer fires state-change event when state property changes; update drawer CSS (to work better when non-modal) (20709258+msmithNI@users.noreply.github.com)

## 1.0.0-beta.88

Tue, 26 Oct 2021 19:50:21 GMT

### Changes

- Test utility folder layout (rajsite@users.noreply.github.com)

## 1.0.0-beta.87

Tue, 26 Oct 2021 16:10:28 GMT

### Changes

- TreeView/TreeItem refactor (26874831+atmgrifter00@users.noreply.github.com)

## 1.0.0-beta.86

Mon, 25 Oct 2021 18:06:36 GMT

### Changes

- Render storybook as string (rajsite@users.noreply.github.com)

## 1.0.0-beta.85

Mon, 25 Oct 2021 15:12:50 GMT

### Changes

- Include angular build in storybook (rajsite@users.noreply.github.com)

## 1.0.0-beta.84

Wed, 20 Oct 2021 23:37:42 GMT

### Changes

- Sidenav/Drawer component (20709258+msmithNI@users.noreply.github.com)

## 1.0.0-beta.83

Wed, 20 Oct 2021 19:37:53 GMT

### Changes

- Added styling and support for headers and non-interactive items in nimble-menu. (35616474+michaeldbrandt@users.noreply.github.com)

## 1.0.0-beta.82

Wed, 20 Oct 2021 00:24:57 GMT

### Changes

- Integrate nimble icons (rajsite@users.noreply.github.com)

## 1.0.0-beta.81

Tue, 19 Oct 2021 20:01:50 GMT

### Changes

- Export types for tab-related elements (5454342+brianehenry@users.noreply.github.com)

## 1.0.0-beta.80

Thu, 14 Oct 2021 19:47:51 GMT

### Changes

- Added styling to allow icons in the start slot of the nimble-menu. (35616474+michaeldbrandt@users.noreply.github.com)

## 1.0.0-beta.79

Thu, 14 Oct 2021 16:03:43 GMT

### Changes

- Initial pass at set of icon components. (26874831+atmgrifter00@users.noreply.github.com)

## 1.0.0-beta.78

Thu, 14 Oct 2021 15:34:51 GMT

### Changes

- Tree Group Selection behavior. (26874831+atmgrifter00@users.noreply.github.com)

## 1.0.0-beta.77

Wed, 13 Oct 2021 18:29:44 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.77 (5454342+brianehenry@users.noreply.github.com)

## 1.0.0-beta.76

Mon, 11 Oct 2021 23:26:07 GMT

### Changes

- CSS Guidelines super rough draft (rajsite@users.noreply.github.com)

## 1.0.0-beta.75

Mon, 11 Oct 2021 21:29:26 GMT

### Changes

- remove unnecessary metas and typo (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.74

Mon, 11 Oct 2021 19:53:26 GMT

### Changes

- add medium-delay token/animation to focus state (1458528+fredvisser@users.noreply.github.com)
- Bump @ni/nimble-components to v1.0.0-beta.74 (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.73

Mon, 11 Oct 2021 16:48:30 GMT

### Changes

- Make tabs inline flex (rajsite@users.noreply.github.com)

## 1.0.0-beta.72

Fri, 08 Oct 2021 20:59:39 GMT

### Changes

- add height to tab-toolbar (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.71

Thu, 07 Oct 2021 22:14:29 GMT

### Changes

- Fixed contents of disabled fields shifting on hover  (5454342+brianehenry@users.noreply.github.com)

## 1.0.0-beta.70

Thu, 07 Oct 2021 21:18:11 GMT

### Changes

- First pass at the menu (35616474+michaeldbrandt@users.noreply.github.com)

## 1.0.0-beta.69

Thu, 07 Oct 2021 20:27:57 GMT

### Changes

- Fix title in storybook (jattasNI@users.noreply.github.com)

## 1.0.0-beta.68

Thu, 07 Oct 2021 20:02:52 GMT

### Changes

- Nimble TreeItem now fires expanded-change when tree item content is clicked (already did so when expand/collapse glyph was clicked) (20709258+msmithNI@users.noreply.github.com)

## 1.0.0-beta.67

Thu, 07 Oct 2021 19:14:44 GMT

### Changes

- Use createRenderer helper for html tagged template (rajsite@users.noreply.github.com)

## 1.0.0-beta.66

Tue, 05 Oct 2021 20:50:12 GMT

### Changes

- Move storybook addon xd to root (rajsite@users.noreply.github.com)

## 1.0.0-beta.65

Thu, 30 Sep 2021 17:53:18 GMT

### Changes

- Update icons and callers (1458528+fredvisser@users.noreply.github.com)
- Bump @ni/nimble-components to v1.0.0-beta.65 (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.64

Thu, 30 Sep 2021 16:40:43 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.64 (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.63

Wed, 29 Sep 2021 20:17:48 GMT

### Changes

- Remove manually added peer dependencies (rajsite@users.noreply.github.com)
- Bump @ni/nimble-components to v1.0.0-beta.63 (rajsite@users.noreply.github.com)

## 1.0.0-beta.62

Tue, 28 Sep 2021 16:05:04 GMT

### Changes

- Refactored invalid property on text field to class (5454342+brianehenry@users.noreply.github.com)

## 1.0.0-beta.61

Mon, 27 Sep 2021 15:05:02 GMT

### Changes

- Switch to html template (rajsite@users.noreply.github.com)

## 1.0.0-beta.60

Fri, 24 Sep 2021 19:09:11 GMT

### Changes

- Introducing new select/expand behavior (26874831+atmgrifter00@users.noreply.github.com)

## 1.0.0-beta.59

Thu, 23 Sep 2021 20:37:34 GMT

### Changes

- Changes to support icons in nimble button (26874831+atmgrifter00@users.noreply.github.com)

## 1.0.0-beta.58

Thu, 23 Sep 2021 19:34:21 GMT

### Changes

- nimble tree view and item with rough styling (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.57

Wed, 22 Sep 2021 23:22:04 GMT

### Changes

- Re-export FAST's DOM.nextUpdate() for usage in Angular tests (5454342+brianehenry@users.noreply.github.com)

## 1.0.0-beta.56

Wed, 22 Sep 2021 17:04:37 GMT

### Changes

- re-enable theme switch and doc changes (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.55

Wed, 22 Sep 2021 16:46:58 GMT

### Changes

- Add tabs-toolbar component (9480438+LukasKall@users.noreply.github.com)

## 1.0.0-beta.54

Mon, 20 Sep 2021 21:01:58 GMT

### Changes

- change icon fill color with theme (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.53

Thu, 16 Sep 2021 15:30:58 GMT

### Changes

- Add simple tab component (9480438+LukasKall@users.noreply.github.com)

## 1.0.0-beta.52

Wed, 15 Sep 2021 20:07:53 GMT

### Changes

- fix bottom borders of text-field and number-field (22551874+scotia673@users.noreply.github.com)

## 1.0.0-beta.51

Tue, 14 Sep 2021 21:19:06 GMT

### Changes

- Use VSCode Tasks to start watch scripts (1458528+fredvisser@users.noreply.github.com)
- Bump @ni/nimble-components to v1.0.0-beta.51 (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.50

Tue, 14 Sep 2021 16:53:39 GMT

### Changes

- uptake DSP font sizes in design-tokens.ts (22551874+scotia673@users.noreply.github.com)
- Bump @ni/nimble-components to v1.0.0-beta.50 (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.49

Mon, 13 Sep 2021 15:09:27 GMT

### Changes

- Add karma reporter to list all tests run during CI (jattasNI@users.noreply.github.com)

## 1.0.0-beta.48

Fri, 10 Sep 2021 19:03:37 GMT

### Changes

- Fix broken link in CONTRIBUTING.md (jattasNI@users.noreply.github.com)

## 1.0.0-beta.47

Fri, 10 Sep 2021 18:13:15 GMT

### Changes

- Created nimble-select and nimble-listbox-option (5454342+brianehenry@users.noreply.github.com)

## 1.0.0-beta.46

Thu, 09 Sep 2021 16:11:55 GMT

### Changes

- add readonly text-field support/styling (22551874+scotia673@users.noreply.github.com)

## 1.0.0-beta.45

Thu, 09 Sep 2021 15:38:58 GMT

### Changes

- use end slot default value for text-field (22551874+scotia673@users.noreply.github.com)

## 1.0.0-beta.44

Thu, 09 Sep 2021 15:24:52 GMT

### Changes

- improve spacing in text-field storybook matrix (22551874+scotia673@users.noreply.github.com)

## 1.0.0-beta.43

Wed, 08 Sep 2021 23:12:35 GMT

### Changes

- Update dependencies (jattasNI@users.noreply.github.com)
- Bump @ni/nimble-components to v1.0.0-beta.43 (jattasNI@users.noreply.github.com)

## 1.0.0-beta.42

Tue, 07 Sep 2021 20:53:58 GMT

### Changes

- tweak number and text field styles based on UX updates (22551874+scotia673@users.noreply.github.com)

## 1.0.0-beta.41

Tue, 07 Sep 2021 20:01:48 GMT

### Changes

- hide password reveal icon in Edge (22551874+scotia673@users.noreply.github.com)

## 1.0.0-beta.40

Fri, 03 Sep 2021 21:30:56 GMT

### Changes

- fix icon issue in firefox (22551874+scotia673@users.noreply.github.com)

## 1.0.0-beta.39

Fri, 03 Sep 2021 21:06:53 GMT

### Changes

- Component usage docs strategy (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.38

Fri, 03 Sep 2021 16:05:47 GMT

### Changes

- [object Object] (26874831+atmgrifter00@users.noreply.github.com)

## 1.0.0-beta.37

Thu, 02 Sep 2021 13:46:41 GMT

### Changes

- LegacyBlue button color token (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.36

Wed, 01 Sep 2021 19:35:53 GMT

### Changes

- combining text-field matrices (22551874+scotia673@users.noreply.github.com)

## 1.0.0-beta.35

Wed, 01 Sep 2021 15:47:53 GMT

### Changes

- added support for invalid state and styling to text-field (22551874+scotia673@users.noreply.github.com)

## 1.0.0-beta.34

Tue, 31 Aug 2021 14:55:33 GMT

### Changes

- Matrix states support (rajsite@users.noreply.github.com)

## 1.0.0-beta.33

Thu, 26 Aug 2021 19:36:52 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.33 (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.32

Thu, 26 Aug 2021 17:52:10 GMT

### Changes

- adding animation delay tokens (1458528+fredvisser@users.noreply.github.com)
- Bump @ni/nimble-components to v1.0.0-beta.32 (1458528+fredvisser@users.noreply.github.com)

## 1.0.0-beta.31

Thu, 26 Aug 2021 15:36:09 GMT

### Changes

- Fix focus state (rajsite@users.noreply.github.com)

## 1.0.0-beta.30

Wed, 25 Aug 2021 13:56:22 GMT

### Changes

- updated styling for text and number fields (22551874+scotia673@users.noreply.github.com)

## 1.0.0-beta.29

Fri, 20 Aug 2021 20:34:16 GMT

### Changes

- apply prettier-fix (fred.visser@ni.com)

## 1.0.0-beta.28

Fri, 20 Aug 2021 13:30:31 GMT

### Changes

- initial legacyBlue theme (fred.visser@ni.com)
- Bump @ni/nimble-components to v1.0.0-beta.28 (fred.visser@ni.com)

## 1.0.0-beta.27

Thu, 19 Aug 2021 21:05:52 GMT

### Changes

- add prettier support (fred.visser@ni.com)

## 1.0.0-beta.26

Wed, 18 Aug 2021 17:48:36 GMT

### Changes

- Update button focus style (christine.karas@ni.com)

## 1.0.0-beta.25

Wed, 18 Aug 2021 16:16:15 GMT

### Changes

- component matrix stories (fred.visser@ni.com)

## 1.0.0-beta.24

Mon, 16 Aug 2021 17:17:45 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.24 (fred.visser@ni.com)

## 1.0.0-beta.23

Thu, 12 Aug 2021 20:46:18 GMT

### Changes

- Switch nimble-theme-provider display mode (rajsite@users.noreply.github.com)
- Bump @ni/nimble-components to v1.0.0-beta.23 (rajsite@users.noreply.github.com)

## 1.0.0-beta.22

Mon, 09 Aug 2021 20:21:46 GMT

### Changes

- add args interface and update checkbox for CSF (fred.visser@ni.com)

## 1.0.0-beta.21

Fri, 06 Aug 2021 18:47:09 GMT

### Changes

- Update to fast-element 1.4.1 (rajsite@users.noreply.github.com)

## 1.0.0-beta.20

Fri, 06 Aug 2021 15:45:51 GMT

### Changes

- Fix checkbox svg on windows (rajsite@users.noreply.github.com)

## 1.0.0-beta.19

Fri, 06 Aug 2021 01:21:32 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.19 (rajsite@users.noreply.github.com)

## 1.0.0-beta.18

Fri, 06 Aug 2021 01:05:01 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.18 (rajsite@users.noreply.github.com)

## 1.0.0-beta.17

Fri, 06 Aug 2021 00:32:42 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.17 (rajsite@users.noreply.github.com)

## 1.0.0-beta.16

Thu, 05 Aug 2021 23:59:22 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.16 (rajsite@users.noreply.github.com)

## 1.0.0-beta.15

Thu, 05 Aug 2021 22:21:19 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.15 (fred.visser@ni.com)

## 1.0.0-beta.14

Thu, 05 Aug 2021 18:43:46 GMT

### Changes

- Add nimble-checkbox component (lukas.kall@ni.com)

## 1.0.0-beta.13

Fri, 30 Jul 2021 18:57:47 GMT

### Changes

- Switch to ES2020 TypeScript code generation (rajsite@users.noreply.github.com)

## 1.0.0-beta.12

Thu, 29 Jul 2021 20:21:54 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.12 (fred.visser@ni.com)

## 1.0.0-beta.11

Thu, 29 Jul 2021 17:51:14 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.11 (rajsite@users.noreply.github.com)

## 1.0.0-beta.10

Wed, 28 Jul 2021 20:38:54 GMT

### Changes

- Fix focus states on Firefox (christine.karas@ni.com)

## 1.0.0-beta.9

Thu, 22 Jul 2021 20:08:12 GMT

### Changes

- Add disabled styles for buttons (christine.karas@ni.com)

## 1.0.0-beta.8

Thu, 22 Jul 2021 00:43:05 GMT

### Changes

- Docs for nimble-number-field (rajsite@users.noreply.github.com)

## 1.0.0-beta.7

Wed, 21 Jul 2021 23:09:43 GMT

### Changes

- Include @storybook/addon-a11y (fred.visser@ni.com)

## 1.0.0-beta.6

Tue, 20 Jul 2021 22:35:42 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.6 (fred.visser@ni.com)

## 1.0.0-beta.5

Tue, 20 Jul 2021 16:48:12 GMT

### Changes

- Add button appearances (christine.karas@ni.com)

## 1.0.0-beta.4

Tue, 20 Jul 2021 15:14:07 GMT

### Changes

- Refactor design token theming and add COLOR theme (christine.karas@ni.com)

## 1.0.0-beta.3

Fri, 16 Jul 2021 22:52:21 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.3 (rajsite@users.noreply.github.com)

## 1.0.0-beta.2

Fri, 16 Jul 2021 16:01:07 GMT

### Changes

- Bump @ni/nimble-components to v1.0.0-beta.2 (fred.visser@ni.com)

## 1.0.0-beta.1

Thu, 15 Jul 2021 21:07:15 GMT

### Changes

- Update outline button styles (christine.karas@ni.com)
