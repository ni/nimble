# Nimble Blazor

## Problem Statement

We would like to offer access to the nimble components as first-class Blazor components.

## Links To Relevant Work Items and Reference Material

[Blazor Support AzDO Feature](https://ni.visualstudio.com/DevCentral/_workitems/edit/1801527)

[Prototype branch](https://github.com/ni/nimble/tree/initial-blazor-integration)

[Microsoft Fluent-based Blazor components](https://github.com/microsoft/fast-blazor)

## Implementation / Design

The primary aspect of having a Blazor version of the nimble components is having a C# .NET Core project as a host for the source, which can then be built and published as a nuget package.

The Microsoft [fast-blazor repo](https://github.com/microsoft/fast-blazor) as well as our initial [Nimble Blazor repo](https://github.com/ni/nimble-blazor) can serve as decent guides to what we will need to have in place in order to do this.

### Component Philosophy

There are a couple of approaches we can take to creating our Blazor components.

#### Option 1:

Extend the classes defined in Microsoft/fast-blazor, where, at a minimum, we simply replace the templates to use our Nimble web components.

_Pros_:

- We get lift from Microsoft/fast-blazor for APIs/implementation
- Easy avenue for us to upstream changes if appropriate

_Cons_:

- Microsoft/fast-blazor is an opinionated implementation around the Fluent design system, and thus there are types and APIs misaligned with our theme system.
- Continued risk of underlying API diverging from our interests

#### Option 2:

Essentially fork Microsoft/fast-blazor, stripping it of all the unlreated APIs/implementation regarding our themeing system.

_Pros_:

- We get to curate our APIs/implementation to suit our needs

_Cons_:

- No community lift from a 3rd party base Blazor library.

#### Recommendation:

The fact that Microsoft/fast-blazor is a fairly opinionated implementation for a separate design system is enough to discourage any attempt to actively use that library as a foundation. We should move forward with our own fork at this point.

It's possible that Microsoft could spearhead an initiative to create a separate foundational Blazor library, if there was enough community interest (as indicated by [this comment](https://discord.com/channels/449251231706251264/744625301040005121/946799095660556348)), and if that happens we should be willing to adjust as needed.

### Initital Component Set

Our Nimble Blazor APIs have the possibility of being functionally different from their wrapped nimble-component counter-parts. This is the case, for instance, with the Microsoft/fast-blazor `FluentNumberField`, which is strictly typed, and does specific types of error reporting if a number is incorrectly formatted.

We need to be deliberate about our API design, but I would suggest not at the cost of holding off on a release of the package until all of the APIs are fleshed out. I propose we come up with an initial set of components to release that offer a straightforward API that we have a high confidence will not change over time (e.g. the NimbleButton).

Proposed Initial Component Set:
- Button
- Checkbox
- Select
- TreeView/TreeItem
- TextField
- Breadcrumb
- ThemeProvider
- Menu
- Toolbar

#### _Working with EditForms_

For situations where we need to provide custom validation behaviors for our components, such as reporting numerical formatting issues (if we wanted to do that), we can simply provide access to the [`EditContext`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.components.forms.editcontext?view=aspnetcore-6.0) through a `CascadingParameter` and set any desired validation messages through it (see Microsoft/fast-blazor [`InputBase`](https://github.com/microsoft/fast-blazor/blob/main/src/Microsoft.Fast.Components.FluentUI/FluentInputBase.cs#L16) as an example).

### Building

In addition to the nuget containing the Blazor components, we may also want to include the minified source of the nimble-components library, as this would sever the need to have a network connection in order to start using the Nimble Blazor components in a dev environment. See [this stackoverflow article](https://stackoverflow.com/questions/48751019/packing-static-content-in-nuget-for-packagereferece-projects) on the topic for how we might go about doing it.

For more info see [Github docs](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-net).

#### _Consuming/Compiling SASS_

While Blazor doesn't natively handle SASS, there are 3rd party tools available that make the process fairly straightforward. The [Microsoft docs](https://docs.microsoft.com/en-us/aspnet/core/blazor/components/css-isolation?view=aspnetcore-6.0#css-preprocessor-support) mention [Delegate.SassBuilder](https://www.nuget.org/packages/Delegate.SassBuilder) as a tool for this, and [this blog](https://chrissainty.com/get-some-sass-into-your-blazor-app/) mentions [WebCompiler](https://github.com/madskristensen/WebCompiler) which is a VS plugin.

#### _Enforcing Coding Conventions_

Since the Blazor solution is C#-based, we will be able to leverage the [NI.CSharp.Analyzers nuget](https://www.nuget.org/packages/NI.CSharp.Analyzers/) to enforce C# style rules. As these rules will cause a Release build to fail, this should be sufficient for the CI to prevent improperly styled code from being submitted.

Code formatting will be enfoced through the presence of an [EditorConfig](https://docs.microsoft.com/en-us/dotnet/fundamentals/code-analysis/configuration-files#editorconfig) file which can be executed programmatically via the "`dotnet format`" command. We should be able to use this command for the "`format`" command specified in the package.json file.

#### _Prerequisite_

Currently the nimble-components repo does not bundle any minified source in its distribution (specifically a single concatenated file). By doing so, we will not only make the distribution of said file possible as part of the Blazor nuget package, but also enable use cases of leveraging nimble components within on-line projects such as stackblitz and CodePen.

### Publishing

The artifact we will produce for publishing purposes will be a nuget. We can likely modify [the workflow](https://github.com/ni/nimble-blazor/blob/main/.github/workflows/main.yml) from the @ni/nimble-blazor repo for the process for building, producing, and publishing the nuget.

We will expect clients to retrieve the Blazor nuget from nuget.org. There already exists a deprecated NimbleBlazor nuget hosted [here](https://www.nuget.org/packages/NimbleBlazor/).

For more info see the following:
- [Publishing .NET NuGet packages using GitHub Actions](https://blog.christiansibo.com/publishing-net-nuget-packages-to-github-using-github-actions/)
- [Set up your NuGet package CI workflow with GitHub Actions](https://www.jamescroft.co.uk/how-to-build-publish-nuget-packages-with-github-actions/)

#### Versioning

To properly version both the nuget package and the contained assembly, we should be able to leverage the beachball tooling, which will interface with a package.json file we will provide (despite the fact that we don't intend to publish to npm) to produce the version number we need, and then utilize it for both the build and pack steps of the pipeline, like so:

```
dotnet build -property:AssemblyVersion=$packageVersion
dotnet pack -p:PackageVersion:$packageVersion
```

#### Questions

1. Can we basically copy the workflow from the above NimbleBlazor repo, and just update as needed? **Answer: Working theory is "yes".**

    a. Can we use the same package (and thus artifact location)? **Answer: Working theory is "yes".**
2. Should we bump .NET version to v6 (this is what Microsoft/fast-blazor uses)? **Answer: yes.**
3. Microsoft/fast-blazor has other workflows in addition to cicd. Namely a "validate" workflow that appears to publish an example app and a codeql analysis workflow which is used to discover potential vulnerabilities. **Answer: We can tinker with this as needed.**

### Testing

The Micosoft/fast-blazor repo is notably devoid of testing, however our previous ni/nimble-blazor repo had an example bUnit test. We should be able to adopt the same strategy with the new Blazor repo.

In addition to running unit tests, we want the Blazor repo to have a similar developer validation experience that the nimble-angular repo offers. Namely we should:

- Provide an example app that tests out each widget
- Link to example app (WebAssembly version) from Storybook landing page
- Run Lighthouse against the example app
- Provide testing support to clients (e.g. test harnesses, mixins) where appropriate

We will be able to execute the automated tests as part of the CI with the "`dotnet test`" command. We should be able to use this command for the workspace "`test`" command (as specified in the package.json file).

For more info see [Github docs](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-net).

### Nimble Workspace Command Summary

The projects under the root nimble workspace should ideally handle each of the root commands. The following outlines the expected way we will support each command:
- `build` : Run the ["`dotnet build`"](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-build) command, or possibly the ["`dotnet msbuild`"](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-msbuild) command in order to set particular project settings (like the Version number to use).
- `lint` : Possibly no CLI support. Linting enforced through building project in Release mode locally. Possibly issue command line warning to this effect. Investigate cited Github action that performs code analysis to see if we can leverage the method it uses.
- `format` : Run the ["`dotnet format`"](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-format) command.
- `test` : Run the ["`dotnet test`"](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-test) command
- `pack` : Run the ["`dotnet pack`"](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-pack) command

### Documentation

- We should provide documentation on the various ways clients can provide access to the nimble web components in their Blazor application.
- Explain the way clients will have to provide CSS for their Blazor components when in a parent component (i.e. must provide the `::deep` pseudo-selector).
- Update existing docs that refer to the Angular integration to mention Blazor where appropriate.

## Alternative Implementations / Designs

1. Regarding the publishing of the nuget, there are a few other approaches that I think can be easily dismissed:
    - Require consumers to manually do their own "`npm install`" of @ni/nimble-components and import all of the necessary JS into their Blazor application as needed.
        - While ultimately we want to support the workflow of allowing clients to only import the files they need, even to the point of documenting this workflow, _requiring_ this of the client seems unnecessary with other options available.
    - Require consumers to import our web components via a CDN (e.g. unpkg.com)
        - Giving clients access to our components via a CDN is extremely valuable, the value of which extends beyond just clients of Nimble Blazor, but, again, requiring it of our clients when other options are available violates our requirement for being able to serve an app when there is no internet access. The only step we're advocating for beyond the minimum necessary for the above is to package the minified file we would be producing for the CDN into the nuget itself, and documenting how to leverage that file in a consumer application.

2. Don't offer Blazor components at all
    - Clients always have the options of using the Nimble components directly in their application. However, this is undesirable for a few, notable reasons:
        - No Intellisense
        - No type-safety
        - No participation in Microsoft EditForm validation

## Open Issues

See questions raised above.
