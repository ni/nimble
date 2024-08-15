This folder contains forked third-party source.

- Each file in this folder should begin with a comment explaining where the file comes from and listing any modifications from the original.
- All comments made by Nimble developers should be prefixed with the tag "`[Nimble]`".

The `directives` folder corresponds to the [`packages/forms/src/directives` folder](https://github.com/angular/angular/tree/15.2.10/packages/forms/src/directives) of the Angular repo. **When updating the version of Angular** used by the `nimble-angular` package:
1. Examine the versions of the files in the `directives` folder. The first comment in each file should contain a link with the release version in it. If the file's version is less than the version of Angular being upgraded to, continue with the following steps to update the files.
2. Update the file content. In most cases the file may have few, if any, changes, so the easiest thing is to use the GitHub compare feature (e.g. url: `github.com/angular/angular/compare/<from-version>...<to-version>`) to migrate individual changes. If the changes are significant, you can instead copy the new version of the file on top of the existing one and migrate diffs as necessary.
3. Update the link in the comment at the top of the file.
4. Update the list of diffs in the comment at the top of the file. (I.e. if you made additional changes.)
5. Verify that all files that have been previously copied are still required, especially those in the `utils` and `testing` directories.
