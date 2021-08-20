# Site

## Overview

This package is a meta package that has scripts that run at the end of build to collect build results with the intention to publish to GitHub Pages.

It publishes items such as the example Angular Client Application, the static Storybook pages, and can be used for capturing additional build time reports in the future such as source coverage, bundle sizes, performance tracking, etc.

## Usage warning

This package is the exception to normal package dependency rules by not having explicit dependencies on other packages and by inspecting non-public contents of other packages such as non-public build artifacts and logs. The package should be only used for informational purposes, should not be published outside GitHub pages, and should not be a dependency of other packages.
