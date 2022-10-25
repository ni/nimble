This folder contains forked third-party source.

- Each file in this folder should begin with a comment explaining where the file comes from and listing any modifications from the original.
- All comments made by Nimble developers should be prefixed with the tag "`[Nimble]`".

The `directives` folder corresponds to the [`packages/forms/src/directives` folder](https://github.com/angular/angular/tree/14.2.6/packages/forms/src/directives) of the Angular repo. **When updating the version of Angular** used by the `nimble-angular` package:
1. Examine the versions of the files in the `directives` folder. The first comment in each file should contain a link with the release version in it. If the file's version is less than the version of Angular being upgraded to, continue with the following steps to update the files.
2. Copy the upgrade version of the files on top of the existing ones, and migrate diffs as necessary.
3. Update the link in the comment at the top of the file.
4. Update the list of diffs in the comment at the top of the file. (I.e. if you made additional changes.)