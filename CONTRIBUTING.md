# Contributing

## Pull Requests, Releases, and Versioning

This repository uses [beachball](https://microsoft.github.io/beachball/) to automate publishing its packages to NPM. The basic workflow is as follows:
1. Every pull request must contain a "change file" which specifies how it affects the versions of each package and includes a description of the change. Developers generate this change file by running `npm run change` before creating the pull request.
1. After the pull request completes, a CI pipeline will inspect the change files to generate changelogs, bump versions in package.json, and publish the newly built packages to NPM.

