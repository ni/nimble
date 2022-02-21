# Nimble Blazor

## Problem Statement

We would like to offer access to the nimble components as first-class Blazor components.

## Links To Relevant Work Items and Reference Material

[Blazor Support AzDO Feature](https://ni.visualstudio.com/DevCentral/_workitems/edit/1801527)

[Prototype branch](https://github.com/ni/nimble/tree/initial-blazor-integration)

## Implementation / Design

The primary aspect of having a Blazor version of the nimble components is having a C# .NET Core project as a host for the source, which can then be built and published as a nuget package.

The Microsoft [fast-blazor repo](https://github.com/microsoft/fast-blazor) as well as our initial [Nimble Blazor repo](https://github.com/ni/nimble-blazor) can serve as decent guides to what we will need to have in place in order to do this.

### Initital Component Set

Our Nimble Blazor APIs have the possibility of being functionally different from their wrapped nimble-component counter-parts. This is the case, for instance, with the Microsoft/fast-blazor NumberField, which is strictly typed, and does specific types of error reporting if a number is incorrectly formatted.

We need to be deliberate about our API design, but I would suggest not at the cost of holding off on a release of the package until all of the APIs are fleshed out. I proposed we come up with an initial set of components to release that offer a straightforward API that we have a high confidence will not change over time (e.g. the NimbleButton).

#### Questions

1. What is the set of components we should commit to the initial release?

### Building

In addition to the nuget containing the Blazor components, we may also want to include the minified source of the nimble-components library, as this would sever the need to have a network connection in order to start using the Nimble Blazor components in a dev environment. See [this stackoverflow article](https://stackoverflow.com/questions/48751019/packing-static-content-in-nuget-for-packagereferece-projects) on the topic for how we might go about doing it.

For more info see [Github docs](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-net).

#### Prerequisite

Currently the nimble-components repo does not bundle any minified source in its distribution (specifically a single concatenated file). By doing so, we will not only make the distribution of said file possible as part of the Blazor nuget package, but also enable use cases of leveraging nimble components within on-line projects such as stackblitz and CodePen.

### Publishing

We will expect clients to retrieve the Blazor nuget from typical sources like nuget.org. There already exists a deprecated NimbleBlazor nuget hosted on nuget.org [here](https://www.nuget.org/packages/NimbleBlazor/).

#### Questions

1. Can we basically copy the workflow from the above NimbleBlazor repo, and just update as needed?

    a. Can we use the same package (and thus artifact location)?
2. Should we bump .NET version to v6 (this is what the Microsoft/fast-blazor uses)?
3. Microsoft/fast-blazor has other workflows in addition to cicd. Namely a "validate" workflow that appears to publish an example app and a codeql analysis workflow which is used to discover potential vulnerabilities.
4. Microsoft/fast-blazor has an .azure-devops workflow. Is this something we should look into?

### Testing

The Micosoft/fast-blazor repo is notably devoid of testing, however our previous ni/nimble-blazor repo had an example bUnit test. We should be able to adopt the same strategy with the new Blazor repo.

For more info see [Github docs](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-net).

## Alternative Implementations / Designs

Regarding the publishing of the nuget, there are a few other approaches that I think can be easily dismissed:
- Require consumers to manually do their own `npm install` of @ni/nimble-components and import all of the necessary JS into their Blazor application as needed.
    - While ultimately we want to support the workflow of allowing clients to only import the files they need, even to the point of documenting this workflow, _requiring_ this of the client seems unnecessary with other options available.
- Require consumers to import our web components via a CDN (e.g. unpkg.com)
    - Giving clients access to our components via a CDN is extremely valuable, the value of which extends beyond just clients of Nimble Blazor, but, again, requiring it of our clients when other options are available seems unnecessary. The only step we're advocating for beyond the minimum necessary for the above is to package the minified file we would be producing for the CDN into the nuget itself, and documenting how to leverage that file in a consumer application.

## Open Issues

See questions raised above.
