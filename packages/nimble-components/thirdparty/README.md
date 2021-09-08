# storybook-addon-xd-designs temporary fork

This package was made because storybook-addon-xd-designs does not yet support [storybook 6](https://github.com/morgs32/storybook-addon-xd-designs/issues/26) in its package configuration.

In addition, patches to the example PR for that issue are needed to use wildcard versions because nimble currently relies on `-alpha` prerelease versions of storybook that would be incompatible with a package that only supports released package versions.

# Steps to recreate package

Sync the following branch (See [latest commit](https://github.com/morgs32/storybook-addon-xd-designs/pull/38/commits/896ba0dfd0714b1c14a4acb16a591b148dccfb20) used as of writing): https://github.com/morgs32/storybook-addon-xd-designs/pull/38

Install [yarn 1](https://classic.yarnpkg.com/en/docs/install/#windows-stable) globally.

Modify the [storybook related dependencies](https://github.com/morgs32/storybook-addon-xd-designs/blob/896ba0dfd0714b1c14a4acb16a591b148dccfb20/packages/storybook-addon-xd-designs/package.json#L24) from `^6.3.7` to `*`. All the `devDependencies` and `peerDependencies` starting with `@storybook` should change to version `*`.

From the repo root run `yarn` to install dependencies and then `yarn build` to compile the addon.

Navigate to the package folder of `packages\storybook-addon-xd-designs` and run `npm pack` to generate a new tgz file.
